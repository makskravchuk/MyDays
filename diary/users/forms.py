from profiles.models import Profile
from django import forms
from django.contrib.auth.models import User
from phonenumber_field.formfields import PhoneNumberField
from django.utils import timezone
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError 

class UserRegisterForm(forms.ModelForm):
    password_confirm = forms.CharField(widget=forms.PasswordInput())

    def __init__(self, *args, **kwargs):
        super(UserRegisterForm,self).__init__(*args, **kwargs)
        self.fields['password'].widget.attrs['placeholder'] = "Введіть пароль"
        self.fields['password_confirm'].widget.attrs['placeholder'] = "Введіть пароль ще раз"
        self.fields['username'].widget.attrs['placeholder'] = "Введіть ім'я користувача"
        self.fields['first_name'].widget.attrs['placeholder'] = "Введіть ваше ім'я"
        self.fields['first_name'].widget.attrs['required'] = True
        self.fields['last_name'].widget.attrs['placeholder'] = "Введіть прізвище"
        self.fields['last_name'].widget.attrs['required'] = True
        self.fields['email'].widget.attrs['placeholder'] = "Введіть електронну пошту"
        self.fields['email'].widget.attrs['required'] = True

    class Meta:
        model = User
        fields = ["username","first_name","last_name","email","password"]
        widgets = {
            'password': forms.PasswordInput(),
        }


    def clean(self):
        cleaned_data = super().clean()
        password = cleaned_data.get("password")
        password_confirm = cleaned_data.get("password_confirm")

        if password != password_confirm:
            raise forms.ValidationError("Паролі не співпадають")

        try:
            validate_password(password)
        except ValidationError as e:
            raise forms.ValidationError(str(e))

        return cleaned_data


class ProfileRegisterForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super(ProfileRegisterForm,self).__init__(*args, **kwargs)
        self.fields['phone_number'].widget.attrs['placeholder'] = "Введіть номер телефону"

    class Meta:
        model = Profile
        fields = ['phone_number','date_of_birth']
        widgets = {
            'date_of_birth': forms.DateInput(attrs={'type': 'date', 'placeholder' : 'Виберіть дату народження'}),
        }

    def clean_date_of_birth(self):
        date_of_birth = self.cleaned_data.get('date_of_birth')
        if date_of_birth.year < 1900 or date_of_birth > timezone.now().date():
            raise forms.ValidationError("Дата народження повинна бути від 1900 року до поточної дати")
        else:
            return date_of_birth 