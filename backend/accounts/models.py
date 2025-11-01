from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser, PermissionsMixin
from django.utils import timezone

# Create your models here.

def validate_cune_email(email):
    """
    Validates an email to be an cune.edu or student.cune.edu email.
    """
    allowed_domains = ["cune.edu", "student.cune.edu"]
    if not any(email.endswith("@" + d) for d in allowed_domains):
        raise ValidationError("Email must be a @cune.edu or @student.cune.edu address.")



class UserManager(BaseUserManager):
    """
    Custom manager for User model that uses email instead of username.
    Automatically generates username, first_name, and last_name from email.
    """

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Users must have an email address")
        email = self.normalize_email(email)

        # Auto-generate names from email
        username, domain = email.split("@")
        first_name, last_name = self._parse_name_from_username(username)

        extra_fields.setdefault("first_name", first_name)
        extra_fields.setdefault("last_name", last_name)

        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(email, password, **extra_fields)

    def _parse_name_from_username(self, username):
        """
        Parses names from emails like firstname.lastname or firstname.lastname123.
        Returns (first_name, last_name)
        """
        parts = username.split(".")
        if len(parts) >= 2:
            first = parts[0]
            # remove trailing digits from last name
            last = ''.join([c for c in parts[1] if not c.isdigit()])
        else:
            first, last = username, ""
        return first.capitalize(), last.capitalize()




class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True, validators=[validate_cune_email])
    first_name = models.CharField(max_length=150, blank=True)
    last_name = models.CharField(max_length=150, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.email})"