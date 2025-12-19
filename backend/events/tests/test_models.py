from django.test import TestCase
from django.core.exceptions import ValidationError
from django.utils import timezone
from django.contrib.auth import get_user_model

from events.models import Event, RSVP

User = get_user_model()

def create_user(email="student@student.cune.edu"):
    return User.objects.create_user(
        email=email,
        password="testpass123"
    )

def create_event(
    *,
    created_by,
    status="pending",
    name="Board Game Night"
):
    return Event.objects.create(
        name=name,
        short_description="Play board games",
        long_description="An evening of fun board games",
        event_time=timezone.now() + timezone.timedelta(days=1),
        location="Student Center",
        image="event_posters/test.jpg",
        contact_email="events@cune.edu",
        created_by=created_by,
        status=status,
    )



class EventModelTests(TestCase):
    def test_event_string_representation_is_event_name(self):
        """
        Events should display using their name for readability
        (used in admin, logs, and UI).
        """
        user = create_user()
        event = create_event(created_by=user, name="Chess Tournament")

        self.assertEqual(str(event), "Chess Tournament")

    def test_new_event_defaults_to_pending_status(self):
        """
        When a student submits an event, it should start as pending.
        """
        user = create_user()
        event = create_event(created_by=user)

        self.assertEqual(event.status, Event.Status.PENDING)

    def test_event_ordering_is_by_event_time_descending(self):
        """
        Events should be ordered so upcoming events appear first.
        """
        user = create_user()

        older = create_event(
            created_by=user,
            name="Older Event",
        )
        older.event_time = timezone.now() + timezone.timedelta(days=1)
        older.save()

        newer = create_event(
            created_by=user,
            name="Newer Event",
        )
        newer.event_time = timezone.now() + timezone.timedelta(days=2)
        newer.save()

        events = list(Event.objects.all())

        self.assertEqual(events[0], newer)
        self.assertEqual(events[1], older)

    def test_denied_event_can_be_resubmitted(self):
        """
        Students should be able to resubmit denied events,
        returning them to pending status.
        """
        user = create_user()
        event = create_event(
            created_by=user,
            status=Event.Status.DENIED
        )

        event.resubmit()

        event.refresh_from_db()
        self.assertEqual(event.status, Event.Status.PENDING)




class RSVPModelTests(TestCase):
    def test_user_can_rsvp_to_approved_event(self):
        """
        Students can RSVP to events that have been approved by SLO.
        """
        user = create_user()
        event = create_event(
            created_by=user,
            status=Event.Status.APPROVED
        )

        rsvp = RSVP.objects.create(
            user=user,
            event=event,
            status="yes"
        )

        self.assertEqual(rsvp.user, user)
        self.assertEqual(rsvp.event, event)
        self.assertEqual(rsvp.status, "yes")

    def test_user_cannot_rsvp_to_unapproved_event(self):
        """
        RSVPs should be blocked for pending or denied events.
        """
        user = create_user()
        event = create_event(
            created_by=user,
            status=Event.Status.PENDING
        )

        with self.assertRaises(ValidationError):
            RSVP.objects.create(
                user=user,
                event=event,
            )

    def test_user_can_only_rsvp_once_per_event(self):
        """
        A user should not be able to RSVP multiple times
        to the same event.
        """
        user = create_user()
        event = create_event(
            created_by=user,
            status=Event.Status.APPROVED
        )

        RSVP.objects.create(user=user, event=event)

        with self.assertRaises(Exception):
            RSVP.objects.create(user=user, event=event)


    def test_rsvp_string_representation_is_human_readable(self):
        """
        RSVPs should have a readable string for admin and debugging.
        """
        user = create_user()
        event = create_event(
            created_by=user,
            status=Event.Status.APPROVED,
            name="Movie Night"
        )

        rsvp = RSVP.objects.create(user=user, event=event)

        self.assertIn("RSVP", str(rsvp))
        self.assertIn("Movie Night", str(rsvp))
