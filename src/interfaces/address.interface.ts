export interface IAddressFieldData {
  value: string
  label: string
  id: string
}

export interface IAddress {
  name: string
  province: string
  district: string
  ward: string
  phoneNumber: string
  longitude?: string
  latitude?: string
  addressDetail: string
}

export interface IAddressReturn extends IAddress {
  id: string
}
