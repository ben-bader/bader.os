import Image from 'next/image'
import { Image as ImageIcon } from 'lucide-react'

type ProjectPreviewProps = {
  title: string
  image?: { src: string; alt: string }
}

export default function ProjectPreview({ title, image }: ProjectPreviewProps) {
  return (
    <figure className="project-preview" aria-label={`${title} project preview`}>
      {image ? (
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(max-width: 700px) 100vw, 45vw"
        />
      ) : (
        <figcaption className="project-preview-placeholder">
          <ImageIcon aria-hidden="true" size={20} strokeWidth={1.5} />
          <span>Project preview</span>
        </figcaption>
      )}
    </figure>
  )
}
