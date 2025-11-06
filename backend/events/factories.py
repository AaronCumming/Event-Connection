import os
import random
import factory
from faker import Faker
from django.conf import settings
from django.utils import timezone
from datetime import datetime, timedelta, time
from django.contrib.auth import get_user_model
from events.models import Event

fake = Faker()
User = get_user_model()


CUNE_EVENT_NAMES = [
    "Morning Chapel Service",
    "Board Game Night",
    "Men's Basketball vs. Hastings",
    "Homecoming Celebration",
    "Student Life Ice Cream Social",
    "Music Department Fall Concert",
    "Art Gallery Opening",
    "Theatre Production: A Midsummer Night's Dream",
    "Campus Worship Night",
    "Career Services Job Fair",
    "Bulldog Football Game",
    "Trivia Night",
    "Community Clean-Up Day",
    "Faith and Life Lecture Series",
    "Wellness Center Yoga Class",
]

CUNE_LOCATIONS = [
    "Thom Auditorium",
    "J-Top",
    "Cattle Conference Room",
    "Weller Hall",
    "Walz Arena",
    "Recital Hall",
    "Thom 203",
    "Fieldhouse",
    "Bulldog Stadium",
    "Thom 113",
    "Dunklau 033",
]

CUNE_DOMAINS = ["student.cune.edu", "cune.edu"]


# Automatically detect all available images in /media/event_posters/
MEDIA_POSTER_DIR = os.path.join(settings.MEDIA_ROOT, "event_posters")

def get_local_posters():
    """Returns a list of full media URLs for available local event posters."""
    if not os.path.exists(MEDIA_POSTER_DIR):
        return []
    files = [
        os.path.join(settings.MEDIA_URL, "event_posters", f)
        for f in os.listdir(MEDIA_POSTER_DIR)
        if f.lower().endswith((".jpg", ".jpeg", ".png"))
    ]
    return files

# Load local image paths once
LOCAL_EVENT_IMAGES = get_local_posters()


def get_event_image():
    """Randomly pick from local posters, fallback to online posters."""
    return random.choice(LOCAL_EVENT_IMAGES)




# Times
def random_event_time():
    """Return a timezone-aware datetime between 9:00 AM and 10:00 PM, on the hour or half-hour."""
    base_date = timezone.now().date() + timedelta(days=random.randint(0, 30))
    hour = random.randint(9, 21)  # 9 AM through 9 PM inclusive
    minute = random.choice([0, 30])
    dt = datetime.combine(base_date, time(hour, minute))
    return timezone.make_aware(dt)






class UserFactory(factory.django.DjangoModelFactory):
    """
    Generates realistic CUNE users with valid email domains.
    Automatically sets first_name and last_name to match CUNE email format.
    """

    class Meta:
        model = User

    first_name = factory.LazyAttribute(lambda _: fake.first_name())
    last_name = factory.LazyAttribute(lambda _: fake.last_name())

    # Email must match validation rules
    email = factory.LazyAttribute(
        lambda obj: f"{obj.first_name.lower()}.{obj.last_name.lower()}@{random.choice(CUNE_DOMAINS)}"
    )

    password = factory.PostGenerationMethodCall("set_password", "password123")

    is_active = True
    is_staff = factory.LazyFunction(lambda: random.choice([False, True]) if random.random() < 0.2 else False)



class EventFactory(factory.django.DjangoModelFactory):
    """
    Generates realistic Concordia events linked to your custom user model.
    """

    class Meta:
        model = Event

    name = factory.LazyFunction(lambda: random.choice(CUNE_EVENT_NAMES))
    short_description = factory.LazyAttribute(lambda _: fake.sentence(nb_words=10))
    long_description = factory.LazyAttribute(lambda _: fake.paragraph(nb_sentences=5))

    event_time = factory.LazyFunction(random_event_time)
    event_end_time = factory.LazyAttribute(
        lambda obj: obj.event_time + timedelta(hours=random.choice([1, 1.5, 2, 2.5, 3]))
    )

    location = factory.LazyFunction(lambda: random.choice(CUNE_LOCATIONS))
    image = factory.LazyFunction(get_event_image)
    contact_email = factory.LazyAttribute(
        lambda _: f"{fake.first_name().lower()}.{fake.last_name().lower()}@student.cune.edu"
    )
    notes_for_slo = factory.LazyAttribute(lambda _: fake.sentence(nb_words=12))

    created_by = factory.SubFactory(UserFactory)
    status = factory.LazyFunction(lambda: random.choice(["approved", "pending", "denied"]))
    reason_denied = factory.LazyAttribute(
        lambda obj: None if obj.status != "denied" else fake.sentence(nb_words=8)
    )



def generate_sample_data(num_users=5, num_events=20):
    """
    Generate sample CUNE users and events for testing.
    """
    users = UserFactory.create_batch(num_users)
    events = EventFactory.create_batch(num_events)
    print(f"Created {num_users} users and {num_events} events.")
    return users, events