import { getUploadURL } from '@/lib/api/file'
import { Input } from '../ui/input'
import { useState } from 'react'
import Image from 'next/image'

export const ImageUploader: React.FC<
  {
    onChange: (path: string) => void
    value?: string
    imageName: string
  } & Parameters<typeof Input>[0]
> = ({ onChange, imageName }) => {
  const [url, setUrl] = useState<string>('')
  const [preview, setPreview] = useState<string>()

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
        onChange(imageName)
      }
      reader.readAsDataURL(file)
      // upload file to url with PUT request
      if (url) {
        fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': file.type,
          },
          body: file,
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error('Failed to upload image')
            }
            return response.text()
          })
          .then((data) => {
            console.log('Image uploaded successfully:', data)
          })
          .catch((error) => {
            console.error('Error uploading image:', error)
          })
      }
    }
  }

  const onClick = async () => {
    const res = await getUploadURL({ name: imageName })
    setUrl(res.url)
  }

  return (
    <>
      {preview && (
        <Image
          className="w-12 h-auto rounded col-span-2"
          src={preview}
          alt={imageName}
          width={50}
          height={50}
        />
      )}
      <Input
        type="file"
        accept="image/*"
        onClick={onClick}
        onChange={handleFileChange}
        value={''}
      />
    </>
  )
}
