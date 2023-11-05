import { useState } from 'react';
import './styles/global.css'

import { useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod'

const createUserFormSchema = z.object({
  name: z.string()
    .min(1, 'O nome é obrigatório')
    .transform(name => {
      return name.trim().split(' ').map(word => {
        return word[0].toLocaleUpperCase().concat(word.substring(1))
      }).join(' ')
    }),
  email: z.string()
    .min(1, 'O email é obrigatório')
    .email('Formato de email inválido')
    .toLowerCase()
    .refine(email => {
      return email.endsWith('.com.br')
    }, 'O email precisa terminar com .com.br'),
  password: z.string()
    .min(6, 'A senha precisa de no mínimo 6 caracteres'),
  techs: z.array(z.object({
    title: z.string().nonempty('O título é obrigatório'),
    knowledge: z.coerce.number().min(1).max(100)
  })).min(2, 'Insira pelo menos duas tecnologias')
})

type createUserFormData = z.infer< typeof createUserFormSchema>

export function App() {
  const [output, setOutput] = useState('');
  
  const { register, handleSubmit, formState: { errors}, control } = useForm<createUserFormData>({
    resolver: zodResolver(createUserFormSchema)
  });

  const {fields, append} = useFieldArray({
    control,
    name: 'techs'
  })

  function addNewTech() {
    append({ title: '', knowledge: 0 })
  }

  function createUser(data: createUserFormData) {
    console.log('chegou');
    setOutput(JSON.stringify(data, null, 2))
  }

  return (
    <main className="h-screen bg-zinc-950 text-zinc-300 flex flex-col gap-10 items-center justify-center">
      <form
        onSubmit={handleSubmit(createUser)} 
        className="flex flex-col gap-4 w-full max-w-xs">

        <div className="flex flex-col gap-1">
          <label htmlFor="name">Name</label>
          <input 
            type="text"
            className="boerder border-zinc-800 shadow-sm rounded h-10 px-3 bg-zinc-900 text-white"
            {...register('name')}/>
          {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="email">Email</label>
          <input 
            type="text"
            className="boerder border-zinc-800 shadow-sm rounded h-10 px-3 bg-zinc-900 text-white"
            {...register('email')}/>
          {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
        </div>

        <div  className='flex flex-col gap-1'>
          <label htmlFor="password">Password</label>
          <input 
            type="password"
            className="boerder border-zinc-800 shadow-sm rounded h-10 px-3 bg-zinc-900 text-white"
            {...register('password')}/>
          {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
        </div>

        <div  className='flex flex-col gap-1'>
          <label htmlFor="" className='flex items-center justify-between'>
            Technologies
            <button type="button" onClick={addNewTech} className="text-emerald-500 text-sm">
              Add
            </button>
          </label>

          {fields.map((field, index) => {
            return (
              <div className="flex gap-2" key={field.id}>
                <div className="flex-1 flex flex-col gap-1">

                  <input 
                    type="text"
                    className="boerder border-zinc-800 shadow-sm rounded h-10 px-3 bg-zinc-900 text-white"
                    {...register(`techs.${index}.title`)}
                  />

                  {errors.techs?.[index]?.title && <span className="text-red-500 text-sm">{errors.techs?.[index]?.title?.message}</span>}

                </div>

                <div className="flex flex-col gap-1">
                  <input 
                    type="number"
                    className="w-16 boerder border-zinc-800 shadow-sm rounded h-10 px-3 bg-zinc-900 text-white"
                    {...register(`techs.${index}.knowledge`)}
                  />

                  {errors.techs?.[index]?.knowledge && <span className="text-red-500 text-sm">{errors.techs?.[index]?.knowledge?.message}</span>}
                </div>
              </div>
            )
          })}

          {errors.techs && <span className="text-red-500 text-sm">{errors.techs.message}</span>}

        </div>


        <button 
          type="submit"
          className="bg-emerald-500 rounded font-semibold text-white h-10 hover:bg-emerald-600">Save</button>
      </form>

      <pre>{output}</pre>

    </main>
  )
}
