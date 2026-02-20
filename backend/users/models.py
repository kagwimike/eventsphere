from django.contrib.auth.models import AbstractUser
from django.db import models
import uuid

class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)

    USERNAME_FIELD = 'username'  # login uses username
    REQUIRED_FIELDS = ['email']   # email is required on creation

    is_active = models.BooleanField(default=True)  # ensure user can login

    def __str__(self):
        return self.username
