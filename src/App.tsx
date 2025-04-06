import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import EventPage from "./pages/events.page";

export default function App() {
    const queryClient = new QueryClient();
    return (
        <QueryClientProvider client={queryClient}>
            <EventPage />
        </QueryClientProvider>
    )
}