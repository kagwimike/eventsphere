from django.urls import path
from .views import RegisterView, LoginView, MeView

urlpatterns = [
    # Result: api/auth/register/
    path('register/', RegisterView.as_view(), name='register'),
    
    # Result: api/auth/login/
    path('login/', LoginView.as_view(), name='login'),
    
    # Result: api/auth/me/  <-- REMOVE 'auth/' FROM HERE
    path('me/', MeView.as_view(), name='me'),  
]