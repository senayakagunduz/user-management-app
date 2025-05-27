import { useState } from 'react'
import './App.css'
import Title from './components/Title'
import Users from './components/Users'
import type { User } from './types/user-types'


function App() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  return (
    <div className='p-5'>
      <Title />
      <Users selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
    </div>
  )
}

export default App
