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
    InvalidForm = 'Please fill in all required fields to proceed to the Next Step',
    RequiredField = '_field is need to be filled',
    EmailField = '_email is need to be a valid email',
    MaxLength = "_field max length is _length"
}

export enum VenueFields {
  email = "Email",
  venue_name = "Venue name",
  mouse_name = "Mouse username",
  short_desc = "Short Description",
  phone = "Phone",
  emails = "Emails",
  country = "Country",
  address = "Address",
  city = "City",
  state = "State",
  user_name = "Mouse username",
  venue_type = "Preffered venue type",
  capacity = "Capacity",
  bathrooms = "Number of bathrooms",
  min_age = "Minimum Age",
  audio_description = "Audio description",
  lighting_description = "Lighting description",
  stage_description = "Stage description",
  minimum_notice = "Minimum notice days",
  price_for_daytime = "Price for daytime",
  price_for_nighttime = "Price for nighttime" ,
}


