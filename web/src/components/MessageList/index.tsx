import { useEffect, useState } from 'react'
import { api } from '../../services/api'
import io from 'socket.io-client'

import styles from './styles.module.less'

import logoImg from '../../assets/logo.svg'

type Message = {
    id: string
    text: string
    user: {
        name: string
        avatar_url: string
    }
}

const messagesQueue: Message[] = []

const socket = io('http://localhost:4000')

socket.on('new_message', (newMessage) => {
    messagesQueue.push(newMessage)
})

export function MessageList() {
    const [messages, setMessages] = useState<Message[]>([])

    /** useEffect(() => {
        const timer = setInterval(() => {
            if (messagesQueue.length > 0) {
                setMessages((prevState) =>
                    [messagesQueue[0], messages[0], messages[1]].filter(Boolean)
                )

                messageQueue.shift()
            }
        }, 3000)
    }, [])*/

    useEffect(() => {
        api.get<Message[]>('messages/last3').then((response) => {
            setMessages(response.data)
        })
    }, [messages])

    return (
        <div className={styles.messageListWrapper}>
            <img src={logoImg} alt="DoWhile2021" />

            <ul className={styles.messageList}>
                {messages.map((message) => {
                    return (
                        <li key={message.id} className={styles.message}>
                            <p className={styles.messageContent}>
                                {message.text}
                            </p>

                            <div className={styles.messageUser}>
                                <div className={styles.userImage}>
                                    <img
                                        src={message.user.avatar_url}
                                        alt={message.user.name}
                                    />
                                </div>
                                <span>{message.user.name}</span>
                            </div>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}