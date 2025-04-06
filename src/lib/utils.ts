import moment from "moment"

export function formatDate(dateString: string, timeOnly = false): string {
  if (timeOnly) {
    return moment(dateString).format("h:mm A")
  }
  return moment(dateString).format("MMM D, YYYY")
}

