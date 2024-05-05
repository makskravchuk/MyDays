from django import forms
from .models import Profile
from django.contrib.auth.models import User


class ProfileEditForm(forms.ModelForm):
    country = forms.ChoiceField(choices=[('','Країна'),('Україна','Україна'),('Польща','Польща'),('США','США'),('Німеччина','Німеччина'),('Канада','Канада'),('Литва','Литва'),('Велика Британія','Велика Британія'),('Франція','Франція'),('Румунія','Румунія'),('Іспанія','Іспанія'),('Італія','Італія')], required=False)
    
    def __init__(self, *args, **kwargs):
        super(ProfileEditForm,self).__init__(*args, **kwargs)
        self.fields['phone_number'].widget.attrs['placeholder'] = "Введіть номер телефону"
        self.fields['city'].widget.attrs['placeholder'] = "Введіть своє місто"

    class Meta:
        model = Profile
        exclude = ['date_of_birth','user']
        widgets = {
            'gender': forms.RadioSelect(),
            'life_status': forms.Textarea(attrs={'placeholder': 'Напишіть ваш життєвий статус', 'class': 'life-status-textarea'}), 
            'about_me': forms.Textarea(attrs={'placeholder': 'Напишіть інформацію про себе', 'class': 'about-me-textarea'}),
            'country': forms.Select(),
            'main_photo': forms.FileInput(attrs={'class': 'choose-profile-main-photo'}), 
        }


class UserEditForm(forms.ModelForm):

    def __init__(self, *args, **kwargs):
        super(UserEditForm,self).__init__(*args, **kwargs)
        self.fields['username'].widget.attrs['placeholder'] = "Введіть ім'я користувача"
        self.fields['first_name'].widget.attrs['placeholder'] = "Введіть ваше ім'я"
        self.fields['first_name'].widget.attrs['required'] = True
        self.fields['last_name'].widget.attrs['placeholder'] = "Введіть прізвище"
        self.fields['last_name'].widget.attrs['required'] = True
        self.fields['email'].widget.attrs['placeholder'] = "Введіть електронну пошту"
        self.fields['email'].widget.attrs['required'] = True

    class Meta:
        model = User
        fields = ["username","first_name","last_name","email"]
