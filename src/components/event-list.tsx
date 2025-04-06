import { useEffect, useState } from "react";
import { Table, Button, Tooltip, Typography, Tag, Space } from "antd";
import { EditOutlined, DeleteOutlined, CalendarOutlined, EnvironmentOutlined, TeamOutlined } from "@ant-design/icons";
import { formatDate } from "../lib/utils";
import { IEvent } from "../services/dtos/event.dto";
import { useGetEvents } from "../services/event.service";

const { Text, Title } = Typography;

export interface EventListProps {
    onEdit: (event: IEvent) => void;
    onDelete: (id: string) => void;
}

export function EventList({ onEdit, onDelete }: EventListProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [events, setEvents] = useState<IEvent[]>([]);
    const { data: responseData, isPending: loading } = useGetEvents(currentPage, pageSize);

    useEffect(() => {
        if (responseData?.success) {
            var eventList = responseData.result.data;
            for (let i = 0; i < eventList.length; i++) {
                eventList[i].startTime = new Date(eventList[i].startTime).toISOString();
                eventList[i].endTime = new Date(eventList[i].endTime).toISOString();
            }
            setEvents(eventList);
        }
    }, [responseData]);

    const desktopColumns = [
        {
            title: "Event Name",
            dataIndex: "name",
            key: "name",
            render: (text: string) => (
                <Text strong className="text-blue-600 text-base">
                    {text}
                </Text>
            ),
        },
        {
            title: "Start Time",
            key: "startTime",
            dataIndex: "startTime",
            render: (time: string) => (
                <Space direction="vertical" size={0}>
                    <Text>{formatDate(time)}</Text>
                    <Text type="secondary" className="text-xs">
                        {formatDate(time, true)}
                    </Text>
                </Space>
            ),
        },
        {
            title: "End Time",
            key: "endTime",
            dataIndex: "endTime",
            render: (time: string) => (
                <Space direction="vertical" size={0}>
                    <Text>{formatDate(time)}</Text>
                    <Text type="secondary" className="text-xs">
                        {formatDate(time, true)}
                    </Text>
                </Space>
            ),
        },
        {
            title: "Venue",
            dataIndex: "venue",
            key: "venue",
            render: (text: string) => (
                <div className="flex items-center">
                    <EnvironmentOutlined className="mr-1 text-gray-500" />
                    <Text>{text}</Text>
                </div>
            ),
        },
        {
            title: "Invitees",
            dataIndex: "invites",
            key: "invites",
            render: (invites: any[]) => {
                if (!invites || invites.length === 0) {
                    return <Tag color="default">No invitees</Tag>;
                }

                return (
                    <div className="flex items-center">
                        <TeamOutlined className="mr-1 text-gray-500" />
                        <Tooltip title={invites.map((i) => i.name).join(", ")}>
                            <Text ellipsis className="max-w-[150px] md:max-w-[200px] block">
                                {invites.length} {invites.length === 1 ? "person" : "people"}
                            </Text>
                        </Tooltip>
                    </div>
                );
            },
        },
        {
            title: "Actions",
            key: "actions",
            align: "right" as const,
            render: (_: any, record: any) => (
                <Space>
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => onEdit(record)}
                        className="bg-blue-500 hover:bg-blue-600"
                        size="small"
                    >
                        Edit
                    </Button>
                    <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => onDelete(record.id)}
                        size="small"
                    >
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    const mobileColumns = [
        {
            title: "Event Details",
            key: "eventDetails",
            render: (_: any, record: IEvent) => (
                <div className="py-2">
                    <Text strong className="text-blue-600 text-base block mb-2">
                        {record.name}
                    </Text>

                    <Space className="mb-2">
                        <CalendarOutlined className="text-gray-500" />
                        <div>
                            <div className="text-sm">
                                <Text>Start: {formatDate(record.startTime)} {formatDate(record.startTime, true)}</Text>
                            </div>
                            <div className="text-sm">
                                <Text>End: {formatDate(record.endTime)} {formatDate(record.endTime, true)}</Text>
                            </div>
                        </div>
                    </Space>

                    <div className="flex items-center mb-2">
                        <EnvironmentOutlined className="text-gray-500 mr-1" />
                        <Text className="text-sm">{record.venue}</Text>
                    </div>

                    <div className="flex items-center mb-3">
                        <TeamOutlined className="text-gray-500 mr-1" />
                        <Text className="text-sm">
                            {record.invites && record.invites.length > 0
                                ? `${record.invites.length} ${record.invites.length === 1 ? "invitee" : "invitees"}`
                                : "No invitees"}
                        </Text>
                    </div>

                    <Space className="pt-1">
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                            onClick={() => onEdit(record)}
                            className="bg-blue-500 hover:bg-blue-600"
                            size="small"
                        >
                            Edit
                        </Button>
                        <Button
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => onDelete(record.id!)}
                            size="small"
                        >
                            Delete
                        </Button>
                    </Space>
                </div>
            ),
        },
    ];

    const useDesktopView = () => {
        const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

        useEffect(() => {
            const handleResize = () => {
                setIsDesktop(window.innerWidth >= 768);
            };

            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }, []);

        return isDesktop;
    };

    const isDesktop = useDesktopView();

    return (
        <div className="w-full">
            {events.length === 0 ? (
                <div className="text-center p-12 bg-gray-50 rounded-lg shadow-sm">
                    <Title level={5} className="text-gray-500 mb-3">No Events Found</Title>
                    <Text type="secondary">Create your first event to get started!</Text>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <Table
                        dataSource={events}
                        columns={isDesktop ? desktopColumns : mobileColumns}
                        rowKey="id"
                        loading={loading}
                        pagination={{
                            current: currentPage,
                            pageSize,
                            total: responseData?.result.totalRecords,
                            showSizeChanger: true,
                            onChange: (page, size) => {
                                setCurrentPage(page);
                                if (size) setPageSize(size);
                            },
                            showTotal: (total, [start, end]) => `Showing ${start} to ${end} of ${total} events`,
                            className: "px-4 py-3",
                        }}
                        className="w-full"
                        scroll={{ x: isDesktop ? 'max-content' : 400 }}
                    />
                </div>
            )}
        </div>
    );
}