import { io } from 'socket.io-client'

const TENYA = process.env.NEXT_PUBLIC_TENYA || 'http://localhost:8080'
const socket = io(TENYA, { autoConnect: false })

export default socket
