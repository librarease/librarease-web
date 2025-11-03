import { FormUploadCSV } from '@/components/books/csv-upload-form'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function ImportBooksPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload CSV File</CardTitle>
        <CardDescription>
          Select a CSV file to preview the import
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormUploadCSV />
      </CardContent>
    </Card>
  )
}
