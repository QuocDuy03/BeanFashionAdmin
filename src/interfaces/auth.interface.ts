export interface ICurrentUser {
  id: string
  fullName: string
  role: string
  email: string
  avatar?: string
  phoneNumber?: string
}

export interface ILoginData {
  email: string
  password: string
}
