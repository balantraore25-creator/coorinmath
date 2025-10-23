export interface ICourse {
  _id: string
  user: string
  title: string
  text: string
  link: string
  completed: boolean
  ticket: number
  createdAt: string
  updatedAt: string
}
export interface Course {
  _id: string
  id: string
  text: string
  link: string
  title: string
  completed: boolean;
  createdAt: string
  updatedAt: string
  username: string // ← si tu utilises aussi course.username
  user: string
 // users: string[]
  ticket: string
}
