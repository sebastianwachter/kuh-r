import QRCode from 'qrcode'

import { HTMLElementEvent } from './types/HTMLElementEvent.type'

const inputElement = document.querySelector('input')
const canvasElement = document.querySelector('canvas')
const buttonElement = document.querySelector('button')

inputElement?.addEventListener('input', (e: Event) => handleInput(e as HTMLElementEvent<HTMLInputElement>))
inputElement?.addEventListener('change', (e: Event) => handleInput(e as HTMLElementEvent<HTMLInputElement>))
inputElement?.addEventListener('blur', (e: Event) => handleInput(e as HTMLElementEvent<HTMLInputElement>))
buttonElement?.addEventListener('click', () => handleFileExport())

function handleInput (event: HTMLElementEvent<HTMLInputElement>): void {
  const { target: { value } } = event

  if (value === '') return

  QRCode.toCanvas(canvasElement, value, (error) => {
    if (error !== null) console.error(error)
  })
}

function handleFileExport (): void {
  canvasElement?.toBlob((blob) => {
    if (blob === null) return console.error('Failed to export file.')
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', URL.createObjectURL(blob))
    linkElement.setAttribute('download', 'kuh-r-code.png')
    document.body.appendChild(linkElement)
    linkElement.click()
    document.body.removeChild(linkElement)
  })
}

inputElement?.dispatchEvent(new Event('blur'))
