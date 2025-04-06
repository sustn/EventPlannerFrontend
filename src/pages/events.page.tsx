import { useState } from "react"
import { Layout, Button, Typography, message } from "antd"
import { EventModal } from "../components/event-modal"
import { EventList } from "../components/event-list"
import { IEvent } from "../services/dtos/event.dto"
import { useCreateUpdateEvent, useDeleteEvent } from "../services/event.service"
import { useQueryClient } from "@tanstack/react-query"
import { PlusOutlined } from "@ant-design/icons";

const { Header, Content } = Layout
const { Title } = Typography

export default function EventPage() {
  const [modalVisible, setModalVisible] = useState(false)
  const [currentEvent, setCurrentEvent] = useState<IEvent | null>(null)

  const queryClient = useQueryClient();
  const { mutate: CreateUpdateEvent } = useCreateUpdateEvent();
  const { mutate: DeleteEvent } = useDeleteEvent();

  const handleSubmit = (data: IEvent) => {
    CreateUpdateEvent( data, {
      onSuccess: (response) => {
        if(response.success){
          message.success(response.message, 3);
        } else {
          message.error(response.message, 5);
        }
        queryClient.invalidateQueries({ queryKey: ["events"] })
      },
      onError: (error) => {
        message.error(error.message, 5);
      }
    })
    setCurrentEvent(null)
  }

  const handleEdit = (event: IEvent) => {
    setCurrentEvent(event)
    setModalVisible(true)
  }

  const handleDelete = (id: string) => {
    DeleteEvent({ id }, {
      onSuccess: (response) => {
        if(response.success){
          message.success(response.message, 3);
        } else {
          message.error(response.message, 5);
        }
        queryClient.invalidateQueries({ queryKey: ["events"] })
      },
      onError: (error) => {
        message.error(error.message, 5);
      }
    })
    
  }

  const handleAddNew = () => {
    setCurrentEvent(null)
    setModalVisible(true)
  }

  return (
    <Layout className="min-h-screen">
      <Header style={{ padding: "0 20px", backgroundColor: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
        <div className="flex justify-between items-center mt-2">
          <Title level={2} style={{ margin: 0 }}>
            Events
          </Title>
          <Button
            type="primary"
            icon={ <PlusOutlined />}
            onClick={handleAddNew}
          >
            New Event
          </Button>
        </div>
      </Header>

      <Content style={{ padding: "20px 20px" }}>
        <EventList onEdit={handleEdit} onDelete={handleDelete} />

        <EventModal
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
          onSubmit={handleSubmit}
          event={currentEvent}
        />
      </Content>
    </Layout>
  )
}
