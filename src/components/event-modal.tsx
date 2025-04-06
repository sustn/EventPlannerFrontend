import { useState, useEffect } from "react";
import { Modal, Form, Input, Button, List } from "antd";
import { Formik } from "formik";
import * as yup from "yup";
import moment from "moment";
import { IEvent, IInvitee } from "../services/dtos/event.dto";

export interface EventModalProps {
    visible: boolean
    onCancel: () => void
    onSubmit?: (data: IEvent) => void
    event: IEvent | null
}

export interface FormValues {
    eventName: string
    startTime: string
    endTime: string
    venue: string
}

export function EventModal({ visible, onCancel, onSubmit, event }: EventModalProps) {
    const [invitees, setInvitees] = useState<IInvitee[]>([]);
    const [newInviteeName, setNewInviteeName] = useState("");
    const [newInviteeEmail, setNewInviteeEmail] = useState("");
    const [inviteeErrors, setInviteeErrors] = useState<{ name?: string; email?: string }>({});

    const validationSchema = yup.object({
        eventName: yup.string().required("Event name is required"),
        venue: yup.string().required("Event venue is required"),
        startTime: yup
            .mixed()
            .required("Start time is required"),
        endTime: yup
            .mixed()
            .required("End time is required")
    });

    useEffect(() => {
        if (event) {
            setInvitees(event.invites);
        } else {
            setInvitees([]);
        }
    }, [event]);

    const initialValues: FormValues = {
        eventName: event?.name || "",
        startTime: event?.startTime ? moment(event.startTime).format("YYYY-MM-DDTHH:mm") : "",
        endTime: event?.endTime ? moment(event.endTime).format("YYYY-MM-DDTHH:mm") : "",
        venue: event?.venue || ""
    };

    const validateInvitee = () => {
        const errors: { name?: string; email?: string } = {};
        if (!newInviteeName.trim()) errors.name = "Name is required";
        if (!newInviteeEmail.trim()) {
            errors.email = "Email is required";
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(newInviteeEmail)) {
            errors.email = "Invalid email address";
        }
        setInviteeErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleAddInvitee = () => {
        if (!validateInvitee()) return;
        const isDuplicateEmail = invitees.some(
            (invitee) => invitee.email.toLowerCase() === newInviteeEmail.toLowerCase()
        );
        if (isDuplicateEmail) {
            setInviteeErrors({
                email: "This email has already been invited.",
            });
            return;
        }
        setInvitees([
            ...invitees,
            {
                id: '00000000-0000-0000-0000-000000000000',
                name: newInviteeName,
                email: newInviteeEmail,
            },
        ]);
        setNewInviteeName("");
        setNewInviteeEmail("");
        setInviteeErrors({});
    };

    const handleRemoveInvitee = (id: string) => {
        setInvitees(invitees.filter((invitee) => invitee.id !== id));
    };

    return (
        <Modal
            title={<span className="text-xl font-semibold text-gray-800">{event ? "Edit Event" : "Create Event"}</span>}
            open={visible}
            onCancel={onCancel}
            footer={null}
            destroyOnClose
            className="rounded-lg"
        >
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    onSubmit?.({
                        id: event?.id || '00000000-0000-0000-0000-000000000000',
                        name: values.eventName,
                        startTime: values.startTime,
                        endTime: values.endTime,
                        venue: values.venue,
                        invites: invitees,
                    });
                    setSubmitting(false);
                    onCancel();
                }}
                enableReinitialize
            >
                {({
                    handleSubmit,
                    handleChange,
                    setFieldValue,
                    values,
                    errors,
                    touched,
                    isSubmitting,
                }) => (
                    <Form layout="vertical" onFinish={handleSubmit}>
                        <Form.Item
                            label={<span className="text-gray-700 font-medium">Event Name</span>}
                            validateStatus={errors.eventName && touched.eventName ? "error" : ""}
                            help={errors.eventName && touched.eventName && (
                                <span className="text-red-500 text-sm">{errors.eventName}</span>
                            )}
                        >
                            <Input
                                name="eventName"
                                placeholder="Event Name"
                                value={values.eventName}
                                onChange={handleChange}
                                className="rounded-lg hover:border-blue-300 focus:border-blue-500"
                            />
                        </Form.Item>

                        <Form.Item
                            label={<span className="text-gray-700 font-medium">Event Venue</span>}
                            validateStatus={errors.venue && touched.venue ? "error" : ""}
                            help={errors.venue && touched.venue && (
                                <span className="text-red-500 text-sm">{errors.venue}</span>
                            )}
                        >
                            <Input
                                name="venue"
                                placeholder="Event Venue"
                                value={values.venue}
                                onChange={handleChange}
                                className="rounded-lg hover:border-blue-300 focus:border-blue-500"
                            />
                        </Form.Item>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="form-item">
                                <label className="block text-gray-700 font-medium mb-2">Start Time</label>
                                <input
                                    type="datetime-local"
                                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                    value={values.startTime ? values.startTime : ""}
                                    onChange={(e) => setFieldValue("startTime", e.target.value)}
                                />
                                {errors.startTime && touched.startTime && (
                                    <span className="text-red-500 text-sm mt-1">{errors.startTime}</span>
                                )}
                            </div>

                            <div className="form-item">
                                <label className="block text-gray-700 font-medium mb-2">End Time</label>
                                <input
                                    type="datetime-local"
                                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                    value={values.endTime ? values.endTime : ""}
                                    onChange={(e) => setFieldValue("endTime", e.target.value)}
                                />
                                {errors.endTime && touched.endTime && (
                                    <span className="text-red-500 text-sm mt-1">{errors.endTime}</span>
                                )}
                            </div>
                        </div>

                        <Form.Item label={<span className="text-gray-700 font-medium">Invitees</span>}>
                            <div className="flex flex-col space-y-3">
                                <div className="flex gap-3">
                                    <div className="flex-1 flex flex-col">
                                        <Input
                                            placeholder="Name"
                                            value={newInviteeName}
                                            onChange={(e) => setNewInviteeName(e.target.value)}
                                            className={`rounded-lg hover:border-blue-300 focus:border-blue-500 py-2 ${inviteeErrors.name ? 'border-red-500' : ''
                                                }`}
                                        />
                                        {inviteeErrors.name && (
                                            <span className="text-red-500 text-sm mt-1">{inviteeErrors.name}</span>
                                        )}
                                    </div>

                                    <div className="flex-1 flex flex-col">
                                        <Input
                                            placeholder="Email"
                                            value={newInviteeEmail}
                                            onChange={(e) => setNewInviteeEmail(e.target.value)}
                                            onPressEnter={handleAddInvitee}
                                            className={`rounded-lg hover:border-blue-300 focus:border-blue-500 py-2 ${inviteeErrors.email ? 'border-red-500' : ''
                                                }`}
                                        />
                                        {inviteeErrors.email && (
                                            <span className="text-red-500 text-sm mt-1">{inviteeErrors.email}</span>
                                        )}
                                    </div>

                                    <Button
                                        type="primary"
                                        onClick={handleAddInvitee}
                                        className="rounded-lg bg-blue-500 hover:bg-blue-600 h-10 px-4 self-start"
                                    >
                                        Add
                                    </Button>
                                </div>

                                {invitees.length > 0 && (
                                    <List
                                        size="small"
                                        bordered
                                        dataSource={invitees}
                                        className="mt-4 border rounded-lg overflow-hidden"
                                        style={{ maxHeight: 150, overflowY: "auto" }}
                                        renderItem={(invitee) => (
                                            <List.Item
                                                className="hover:bg-gray-50 px-4 py-3 transition-colors border-0 border-b last:border-b-0"
                                                actions={[
                                                    <Button
                                                        danger
                                                        type="text"
                                                        onClick={() => handleRemoveInvitee(invitee.id)}
                                                        className="text-red-500 hover:text-red-600 px-3"
                                                    >
                                                        Remove
                                                    </Button>,
                                                ]}
                                            >
                                                <List.Item.Meta
                                                    title={<span className="font-medium text-gray-800">{invitee.name}</span>}
                                                    description={<span className="text-gray-600">{invitee.email}</span>}
                                                />
                                            </List.Item>
                                        )}
                                    />
                                )}
                            </div>
                        </Form.Item>

                        <div className="flex justify-end space-x-3 pt-4">
                            <Button
                                onClick={onCancel}
                                className="rounded-lg px-6 h-9 hover:bg-gray-100 border-gray-300 text-gray-700"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={isSubmitting}
                                className="rounded-lg px-6 h-9 bg-blue-500 hover:bg-blue-600 border-transparent text-white"
                            >
                                {event ? "Save Changes" : "Add Event"}
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </Modal>
    );
}