import { Hono } from 'hono'
import { z } from 'zod'
import { CreateUser, FindUserById } from '../applications/services'
import { ROLE } from '../domain'
import UserRepository from '../repositories/UserRepository'

const findUserByIdSchemaInput = z.object({
  where: z
    .object({
      id: z.string(),
    })
})

const CreateUserSchemaInput = () => {
  // const phoneRule = z
  //   .string()
  //   .refine((value) => /^[+]{1}(?:[0-9-()/.]\s?){6,15}[0-9]{1}$/.test(value))

  const schema = z.object({
    name: z.string().trim().min(1),
    email: z.string(),
    role: z.enum(ROLE),
    username: z.string().optional(),
  })

  return schema
}

const users = new Hono()

users.post('/', async (c) => {
  const data = await c.req.json()

  const { name, email, role, username } = CreateUserSchemaInput().parse(data)

  const createUser = CreateUser(new UserRepository())
  const response = await createUser.execute({
    name,
    email,
    role,
    username: username ?? email.split('@')[0],
  })

  return c.json(response, 200)
})

users.post('/count', async (c) => {
  const { where } = findUserByIdSchemaInput.parse(await c.req.json())

  const findUserById = new FindUserById(new UserRepository())

  const response = await findUserById.execute({
    where,
  })

  return c.json(response, 200)
})

users.get('/', (c) => c.text('List users'))

users.get('/:id', (c) => {
  const id = c.req.param('id')
  return c.text(`Get user: ${id}`)
})

export { users as usersModule }
