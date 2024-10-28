"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface User {
  userID: string;
  userName: string;
  email: string;
  picture: {
    large: string;
    medium: string;
    thumbnail: string;
  };
  location: {
    city: string;
    country: string;
  };
  phone: string;
  cell: string;
  login: {
    username: string;
    password: string;
  };
}

const formSchema = z.object({
  count: z.string().transform((v) => Number(v) || 0),
})

export function InputForm() {
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const res = await fetch(`https://randomuser.me/api/?results=${values.count.toString()}`)
      const data = await res.json()

      const usersData = data.results.map((user: any) => ({
        userID: user.login.uuid,
        userName: `${user.name.title} ${user.name.first} ${user.name.last}`,
        email: user.email,
        picture: user.picture,
        location: {
          city: user.location.city,
          country: user.location.country,
        },
        phone: user.phone,
        cell: user.cell,
        login: {
          username: user.login.username,
          password: user.login.password,
        },
      }))
      setUsers(usersData)
    } catch (error) {
      console.error("Failed to fetch user data:", error)
    }
  }

  return (
    <div className="space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="count"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enter Number of Users</FormLabel>
                <FormControl>
                  <Input placeholder="1" {...field} />
                </FormControl>
                <FormDescription>
                  Please enter a valid number.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {users.map((user) => (
          <Card key={user.userID} className="shadow-lg">
            <CardHeader>
              <img src={user.picture.large} alt={user.userName} className="w-full h-32 object-cover rounded-t-lg" />
              <CardTitle>{user.userName}</CardTitle>
            </CardHeader>
            <CardContent>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Location:</strong> {user.location.city}, {user.location.country}</p>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setSelectedUser(user)}>Hack</Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {selectedUser && (
        <Dialog open={true} onOpenChange={() => setSelectedUser(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedUser.userName}'s Profile</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p><strong>Username:</strong> {selectedUser.login.username}</p>
              <p><strong>Password:</strong> {selectedUser.login.password}</p>
            </div>
            <Button onClick={() => setSelectedUser(null)} className="mt-4">Close</Button>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

export default InputForm