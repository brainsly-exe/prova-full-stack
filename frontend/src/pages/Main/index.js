import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { FiLogOut, FiCheck, FiPlusCircle, FiCheckSquare, FiTrash2 } from 'react-icons/fi'

import './styles.css'

import api from '../../services/api'
import { logout } from '../../services/auth'

export default function Main() {
    const [tasks, setTasks] = useState([])

    const userId = localStorage.getItem('userId')

    const history = useHistory()

    // FUNÇÃO QUE CARREGA AS TASKS
    useEffect(() => {
        async function loadTasks() {
            const response = await api.get('/tasks', {
                headers: {
                    user: userId
                }
            })
            setTasks(response.data)
        }
        loadTasks()
    }, [tasks])

    // FUNÇÃO QUE DELETA A TASK SELECIONADA
    async function handleDeleteTask(id) {
        try {
            await api.delete(`/task/${id}`, {
                headers: {
                    user: userId
                }
            })

            setTasks(tasks.filter(task => task.id !== id))

        } catch (err) {
            alert('Ocorreu um erro ao deletar a tarefa.')
        }
    }

    // FUNÇÃO QUE ATUALIZA O STATUS DA TASK SELECIONADA
    async function handleUpdateTask(id) {
        try {
            await api.put(`/task/${id}`, "", {
                headers: {
                    user: userId
                }
            })


        } catch (err) {
            alert('Ocorreu um erro ao atualizar a tarefa.')
        }
    }

    // FUNÇÃO QUE REALIZA O LOGOUT DO USUÁRIO
    async function handleLogout(e) {
        e.preventDefault()

        logout()
        localStorage.removeItem('user_id')

        history.push('/')
    }

    return (
        <>
            <button className="btn-logout" onClick={handleLogout}>
                Sair
            <FiLogOut style={{ marginLeft: 2 }} />
            </button>

            <div className="tasks-container">
                <h1>MINHAS TAREFAS</h1>

                {tasks.map(task => (
                    <div className="task-box">
                        {task.status == 1 ? <FiCheck color="#00FF00" size={20} /> : null}
                        
                        <span className="title">{task.title}</span>
                        <p className="description">{task.description}</p>
                        <p className="category">{task.category}</p>
                        
                        <span className="date">
                            <p>{task.initial_date ? `Data Inicial: ${task.initial_date.replace(/-/g, "/").replace("T", " ")}` : null}</p>
                            <p>{task.final_date ? `Data Final: ${task.final_date.replace(/-/g, "/").replace("T", " ")}` : null}</p>
                        </span>

                        <button onClick={() => handleUpdateTask(task.id)} title="Marcar ou desmarcar como concluido." className="btn-action">
                            {task.status == 0 ? <FiCheckSquare color="#00FF00"/> : <FiCheckSquare color="#E02041"/>}
                        </button>

                        <button onClick={() => handleDeleteTask(task.id)} title="Excluir tarefa." className="btn-action">
                            <FiTrash2 color="E02041" />
                        </button>

                    </div>
                ))}
            </div>

            <Link to="/task/new" className="btn-create-task">
                <FiPlusCircle size={60} color="#00FF00" />
            </Link>
        </>
    )
}