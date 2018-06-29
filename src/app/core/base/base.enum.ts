import {FormControl, Validators} from '@angular/forms';

export enum UserEnumStatus {
    None = 0,
    User = 1,
    Receptionist = 2,
    Creator = 3
}
export enum UserEnumRole{
    User = "user",
    Receptionist = "receptionist",
    Creator = "creator"
}
export enum AccountType{
    Fan = "fan",
    Venue = "venue",
    Artist = "artist"
}
export enum VenueType{
    Public = "public_venue",
    Private = "private_residence"
}

export enum BaseImages{
    Drake = "../../assets/img/show.png",
    NoneUserImage = "../../assets/img/non-photo.svg",
    NoneFolowerImage = "../../assets/img/non-photo-2.svg"
}

export enum BaseErrors{
    

}

export enum BaseMessages{
    Success = "Success",
    Fail = "Failed",
    Incorrect = 'Incorrect login or password',
    RequiredField = '<b>_field</b> needs to be filled',
    RequiredFields = 'Please fill in _fields to proceed to the Next Step',
    EmailField = '<b>_email</b> needs to be a valid email',
    EmailPattern = '<b>_email</b> needs to be a valid email',
    NumberPattern = '<b>_field</b> needs to be a valid number',
    MaxLength = '<b>_field</b> max length is _length',
    AllFields = 'Please fill in all required fields'

}

export enum VenueFields {
  email = 'Email',
  venue_name = 'Venue name',
  mouse_name = 'Mouse username',
  short_desc = 'Short Description',
  phone = 'Phone',
  emails = 'Emails',
  country = 'Country',
  address = 'Address',
  city = 'City',
  state = 'State',
  user_name = 'Mouse username',
  venue_type = 'Preffered venue type',
  capacity = 'Capacity',
  bathrooms = 'Number of bathrooms',
  min_age = 'Minimum Age',
  audio_description = 'Audio description',
  lighting_description = 'Lighting description',
  stage_description = 'Stage description',
  minimum_notice = 'Minimum notice days',
  price_for_daytime = 'Price for daytime',
  price_for_nighttime = 'Price for nighttime',
}


export enum ArtistFields {
  user_name = 'Username',
  display_name = 'Full name',
  artist_email = 'Email address',
  about = 'Short description',
  song_name = 'Song name',
  album_name = 'Album name',
  audio_link = 'Link',
  album_artwork = 'Album artwork',
  album_link = 'Link',
  name = 'Song name',
  link = 'Link',
}

export enum FanFields {
  user_name = 'Username',
}

export enum EventFields {
  name = 'Event name',
  tagline = 'Tagline',
  hashtag = 'Hashtag',
  event_time = 'Event time range',
  event_length = 'Event length',
  event_year = 'Event date year',
  event_season = 'Event season',
  description = 'Short description',
  funding_goal = 'Funding goal',
  artists_number = 'Number of artists',
}

export enum BaseFields {
  user_name = 'Username',
  first_name = 'First name',
  last_name = 'Last name',
  password = 'Password',
  password_confirm = 'Password confirmation',
  password_confirmation = 'Password confirmation',
  register_phone = 'Phone',
  email = 'Email',
  phone = 'Phone is'
}


