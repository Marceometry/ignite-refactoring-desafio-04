import { useEffect, useState } from 'react'

import { Header } from '../../components/Header'
import api from '../../services/api'
import Food from '../../components/Food'
import ModalAddFood from '../../components/ModalAddFood'
import ModalEditFood from '../../components/ModalEditFood'
import { FoodModel } from '../../types'
import { FoodsContainer } from './styles'

export const Dashboard = () => {
  const [foods, setFoods] = useState<FoodModel[]>([])
  const [state, setState] = useState({
    editingFood: {} as FoodModel,
    modalOpen: false,
    editModalOpen: false,
  })

  useEffect(() => {
    const loadInfo = async () => {
      const response = await api.get('/foods')
      setFoods(response.data)
    }
    loadInfo()
  }, [])

  const handleAddFood = async (food: FoodModel) => {
    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      })

      setFoods([...foods, response.data])
    } catch (err) {
      console.log(err)
    }
  }

  const handleUpdateFood = async (food: FoodModel) => {
    const { editingFood } = state

    try {
      const foodUpdated = await api.put(`/foods/${editingFood.id}`, {
        ...editingFood,
        ...food,
      })

      const foodsUpdated = foods.map((f) =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data
      )

      setFoods(foodsUpdated)
    } catch (err) {
      console.log(err)
    }
  }

  const handleDeleteFood = async (id: number) => {
    await api.delete(`/foods/${id}`)

    const foodsFiltered = foods.filter((food) => food.id !== id)

    setFoods(foodsFiltered)
  }

  const toggleModal = () => {
    const { modalOpen } = state

    setState({ ...state, modalOpen: !modalOpen })
  }

  const toggleEditModal = () => {
    const { editModalOpen } = state

    setState({ ...state, editModalOpen: !editModalOpen })
  }

  const handleEditFood = (food: FoodModel) => {
    setState({ ...state, editingFood: food, editModalOpen: true })
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={state.modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={state.editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={state.editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid='foods-list'>
        {foods &&
          foods.map((food) => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  )
}
