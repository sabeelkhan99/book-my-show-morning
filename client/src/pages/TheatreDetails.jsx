import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Alert, Button, Card, Descriptions, Divider, Form, InputNumber, Select, Spin, Tag, message } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import useHttp from '../hooks/useHttp'
import { createScreening, fetchMovies, fetchTheatreById } from '../lib/apis'

const TheatreDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form] = Form.useForm()

  const { data: theatre, error, isLoading, sendRequest } = useHttp(fetchTheatreById, true)
  const { data: movies, error: moviesError, isLoading: moviesLoading, sendRequest: sendMoviesRequest } = useHttp(fetchMovies, true)
  const {
    data: screening,
    error: screeningError,
    isLoading: screeningLoading,
    sendRequest: sendCreateScreeningRequest,
  } = useHttp(createScreening, false)

  useEffect(() => {
    if (id) {
      sendRequest(id)
    }
  }, [id])

  useEffect(() => {
    sendMoviesRequest()
  }, [])

  useEffect(() => {
    if (screening) {
      message.success('Screening created successfully')
      form.resetFields(['movieId', 'price', 'showTimings'])
    }
  }, [screening, form])

  useEffect(() => {
    if (screeningError) {
      message.error(screeningError || 'Failed to create screening')
    }
  }, [screeningError])

  if (isLoading) {
    return (
      <div style={{ padding: '24px 8px', maxWidth: 900, margin: '0 auto' }}>
        <div style={{ marginBottom: 16 }}>
          <Button
            type="link"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
            style={{ paddingLeft: 0 }}
          >
            Back
          </Button>
        </div>
        <div style={{ minHeight: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Spin size="large" description="Loading theatre details..." />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: '24px 8px', maxWidth: 900, margin: '0 auto' }}>
        <div style={{ marginBottom: 16 }}>
          <Button
            type="link"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
            style={{ paddingLeft: 0 }}
          >
            Back
          </Button>
        </div>
        <Alert
          message="Unable to load theatre"
          description={error}
          type="error"
          showIcon
        />
      </div>
    )
  }

  if (!theatre) return null

  return (
    <div style={{ padding: '24px 8px 32px', maxWidth: 900, margin: '0 auto' }}>
      <div style={{ marginBottom: 16 }}>
        <Button
          type="link"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          style={{ paddingLeft: 0 }}
        >
          Back
        </Button>
      </div>

      <Card
        title={
          <span style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span>{theatre.name}</span>
            {typeof theatre.capacity !== 'undefined' && (
              <Tag color="blue">Capacity: {theatre.capacity}</Tag>
            )}
          </span>
        }
      >
        <Descriptions bordered size="middle" column={1}>
          <Descriptions.Item label="Address">{theatre.address || '-'}</Descriptions.Item>
          <Descriptions.Item label="Contact">{theatre.contactNo || '-'}</Descriptions.Item>
          {theatre.user && (
            <Descriptions.Item label="Owner">
              {theatre.user.name || theatre.user.email || theatre.user._id}
            </Descriptions.Item>
          )}
        </Descriptions>

        <Divider style={{ marginBlock: 20 }} />

        <div style={{ fontWeight: 600, marginBottom: 12 }}>Create screening</div>

        {moviesError && (
          <Alert
            type="error"
            showIcon
            message="Unable to load movies"
            description={moviesError}
            style={{ marginBottom: 12 }}
          />
        )}

        <Form
          layout="vertical"
          form={form}
          onFinish={(values) =>{
            sendCreateScreeningRequest({
              theatreId: id,
              movieId: values.movieId,
              price: values.price,
              showTimings: values.showTimings,
            })
          }
          }
        >
          <Form.Item
            label="Movie"
            name="movieId"
            rules={[{ required: true, message: 'Please select a movie' }]}
          >
            <Select
              placeholder={moviesLoading ? 'Loading movies...' : 'Select a movie'}
              loading={moviesLoading}
              disabled={moviesLoading || !!moviesError}
              showSearch
              optionFilterProp="label"
              options={(movies || []).map((m) => ({ value: m._id, label: m.title }))}
            />
          </Form.Item>

          <Form.Item
            label="Ticket price"
            name="price"
            rules={[{ required: true, message: 'Please enter a price' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} placeholder="e.g. 200" />
          </Form.Item>

          <Form.Item
            label="Show timings"
            name="showTimings"
            rules={[
              { required: true, message: 'Please add at least one show timing' },
              { type: 'array', min: 1, message: 'Please add at least one show timing' },
            ]}
            extra='Type a time and press Enter (e.g. "3:00PM")'
          >
            <Select mode="tags" placeholder='e.g. 3:00PM, 6:00PM' />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={screeningLoading}
              disabled={screeningLoading || moviesLoading || !!moviesError}
            >
              Create screening
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default TheatreDetails

