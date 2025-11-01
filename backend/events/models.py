from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError
from django.contrib.auth.models import AbstractUser
from django.utils import timezone

# Create your models here.
class Record(models.Model):

    name = models.CharField(max_length=255)
    value = models.IntegerField()

    def __str__(self):
        return self.name



class Event(models.Model):
    """
    Event model representing a student-submitted or approved event.
    """

    class Status(models.TextChoices):
        PENDING = ("pending", "Pending")
        APPROVED = ("approved", "Approved")
        DENIED = ("denied", "Denied")


    name = models.CharField(
        max_length=511,
        verbose_name="Event Name",
        help_text="The name or title of the event."
    )
    short_description = models.CharField(
        max_length=511,
        verbose_name="Short Description",
        help_text="A brief summary of the event, usually one sentence."
    )
    long_description = models.TextField(
        verbose_name="Long Description",
        help_text="Detailed information about the event or additional details."
    )
    event_time = models.DateTimeField(
        verbose_name="Event Date and Time",
        help_text="The time and day when the event is scheduled to occur."
    )
    location = models.CharField(
        max_length=511,
        verbose_name="Event Location",
        help_text="The area or location where the event will take place."
    )
    image = models.ImageField(
        upload_to="event_posters/",
        verbose_name="Event Image",
        help_text="A poster or image for the event."
    )
    contact_email = models.EmailField(
        verbose_name="Event Contact Email",
        help_text="The contact email for the event, used for questions or responses."
    )

    # Not displayed publicly to the students
    notes_for_slo = models.TextField(
        blank=True,
        null=True,
        verbose_name="Notes for SLO",
        help_text="Internal notes for the Student Life Office regarding this event."
    )

    # Not submitted by student, autocompleted
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="events",
        verbose_name="Created By",
        help_text="The student or user who submitted or created the event."
    )

    # Not displayed publicly to the students
    # Not submitted by student
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default="pending",
        verbose_name="Event Status",
        help_text="The current approval status of the event: pending, approved, or denied."
    )

    # Not displayed publicly to the students
    # Not submitted by student
    reason_denied = models.TextField(
        blank=True,
        null=True,
        verbose_name="Reason Denied",
        help_text="If the event is denied, the reason for denial is provided."
    )

    # Not displayed publicly to the students
    # Not submitted by student, autocompleted
    time_submitted = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Time Submitted",
        help_text="The time and day the event was first submitted."
    )

    # Not displayed publicly to the students
    # Not submitted by student, autocompleted
    last_submitted = models.DateTimeField(
        auto_now=True,
        verbose_name="Last Submitted",
        help_text="The time and day the event was last submitted or resbmitted for approval."
    )



    class Meta:
        verbose_name = "Event"
        verbose_name_plural = "Events"
        ordering = ["-event_time"]

    def __str__(self):
        return f"{self.name}"


    def resubmit(self):
        """
        Custom helper for students resubmitting denied events.
        Sets status back to 'pending' and updates last_submitted timestamp.
        """
        self.status = self.Status.PENDING
        self.last_submitted = timezone.now()
        self.save()









class RSVP(models.Model):
    """
    Model representing a user's RSVP to an event.
    """
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="rsvps",
        verbose_name="User",
        help_text="The user who is RSVPing for the event."
    )
    event = models.ForeignKey(
        Event,
        on_delete=models.CASCADE,
        related_name="rsvps",
        verbose_name="Event",
        help_text="The event the user is RSVPing to."
    )
    status = models.CharField(
        max_length=5,
        choices=[("yes", "Yes"), ("no", "No")],
        default="yes",
        verbose_name="RSVP Status",
        help_text="Whether the user will attend the event (yes, no)."
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="RSVP Created At",
        help_text="Timestamp when the RSVP was created."
    )

    class Meta:
        unique_together = ("user", "event")  # Each user can RSVP to an event only once
        verbose_name = "RSVP"
        verbose_name_plural = "RSVPs"

    def __str__(self):
        return f"{self.user} RSVP for {self.event}"


    def clean(self):
        # Enforce that RSVPs are only allowed for approved events
        if self.event.status != "approved":
            raise ValidationError("You can only RSVP to approved events.")

    def save(self, *args, **kwargs):
        self.full_clean()  # calls clean() automatically
        super().save(*args, **kwargs)



# Not in MVP: notifications table foreign key on user and event