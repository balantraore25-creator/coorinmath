export interface User {
  _id: string;
  id: string
  username: string
  password?: string   
  roles: string[]
  active: boolean
}

