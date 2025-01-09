'use client'
import { useState } from 'react'
import { saveAs } from 'file-saver'
import JSZip from 'jszip'

// VariantBase64 编码相关
const VariantBase64Table = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='.split('')
const VariantBase64Dict: { [key: number]: string } = {}
VariantBase64Table.forEach((val, i) => VariantBase64Dict[i] = val)

// License 类型
const LICENSE_TYPES = {
  Professional: 1,
  Educational: 3,
  Personal: 4
} as const

declare global {
  interface String {
    toBytes(): number[]
  }
}

String.prototype.toBytes = function(): number[] {
  const bytes: number[] = []
  for (let i = 0; i < this.length; i++) {
    const char = this.charCodeAt(i)
    if (char >= 0x010000 && char <= 0x10FFFF) {
      bytes.push(((char >> 18) & 0x07) | 0xF0)
      bytes.push(((char >> 12) & 0x3F) | 0x80)
      bytes.push(((char >> 6) & 0x3F) | 0x80)
      bytes.push((char & 0x3F) | 0x80)
    } else if (char >= 0x000800 && char <= 0x00FFFF) {
      bytes.push(((char >> 12) & 0x0F) | 0xE0)
      bytes.push(((char >> 6) & 0x3F) | 0x80)
      bytes.push((char & 0x3F) | 0x80)
    } else if (char >= 0x000080 && char <= 0x0007FF) {
      bytes.push(((char >> 6) & 0x1F) | 0xC0)
      bytes.push((char & 0x3F) | 0x80)
    } else {
      bytes.push(char & 0xFF)
    }
  }
  return bytes
}

export default function MobaCalculator() {
  const [userName, setUserName] = useState('defaultUser')
  const [versionName, setVersionName] = useState('21.0')
  const [userNum, setUserNum] = useState('1')
  const [licenseType, setLicenseType] = useState<number>(1)
  const [showTips, setShowTips] = useState<string>('')

  // 工具函数
  const toBytes = (str: string): number[] => {
    const bytes: number[] = []
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      if (char >= 0x010000 && char <= 0x10FFFF) {
        bytes.push(((char >> 18) & 0x07) | 0xF0)
        bytes.push(((char >> 12) & 0x3F) | 0x80)
        bytes.push(((char >> 6) & 0x3F) | 0x80)
        bytes.push((char & 0x3F) | 0x80)
      } else if (char >= 0x000800 && char <= 0x00FFFF) {
        bytes.push(((char >> 12) & 0x0F) | 0xE0)
        bytes.push(((char >> 6) & 0x3F) | 0x80)
        bytes.push((char & 0x3F) | 0x80)
      } else if (char >= 0x000080 && char <= 0x0007FF) {
        bytes.push(((char >> 6) & 0x1F) | 0xC0)
        bytes.push((char & 0x3F) | 0x80)
      } else {
        bytes.push(char & 0xFF)
      }
    }
    return bytes
  }

  const toInt = (bytes: number[], offset = 0): number => {
    return ((bytes[offset] & 0xFF)
      | ((bytes[offset + 1] & 0xFF) << 8)
      | ((bytes[offset + 2] & 0xFF) << 16)
      | ((bytes[offset + 3] & 0xFF) << 24))
  }

  const EncryptBytes = (key: number, bs: number[]): number[] => {
    const result: number[] = []
    bs.forEach(val => {
      result.push(val ^ ((key >> 8) & 0xff))
      key = result[result.length - 1] & key | 0x482D
    })
    return result
  }

  const VariantBase64Encode = (bs: number[]): number[] => {
    const result: number[] = []
    const blocks_count = Math.floor(bs.length / 3)
    const left_bytes = bs.length % 3

    let coding_int, block
    for (let i = 0; i < blocks_count; i++) {
      coding_int = toInt(bs.slice(3 * i, 3 * i + 3))
      block = VariantBase64Dict[coding_int & 0x3f]
      block += VariantBase64Dict[(coding_int >> 6) & 0x3f]
      block += VariantBase64Dict[(coding_int >> 12) & 0x3f]
      block += VariantBase64Dict[(coding_int >> 18) & 0x3f]
      result.push(...block.toBytes())
    }

    switch (left_bytes) {
      case 0:
        return result
      case 1:
        coding_int = toInt(bs.slice(3 * blocks_count))
        block = VariantBase64Dict[coding_int & 0x3f]
        block += VariantBase64Dict[(coding_int >> 6) & 0x3f]
        result.push(...toBytes(block))
        return result
      default:
        coding_int = toInt(bs.slice(3 * blocks_count))
        block = VariantBase64Dict[coding_int & 0x3f]
        block += VariantBase64Dict[(coding_int >> 6) & 0x3f]
        block += VariantBase64Dict[(coding_int >> 12) & 0x3f]
        result.push(...toBytes(block))
        return result
    }
  }

  const generateLicense = (type: number, userName: string, count: number, majorVersion: number, minorVersion: number): string => {
    const licenseSourceStr = `${type}#${userName}|${majorVersion}${minorVersion}#${count}#${majorVersion}3${minorVersion}6${minorVersion}#0#0#0#`
    const encrypted = EncryptBytes(0x787, licenseSourceStr.toBytes())
    const encoded = VariantBase64Encode(encrypted)
    return String.fromCharCode(...encoded)
  }

  // 输入验证
  const validateInput = (value: string, pattern: string, tips: string): boolean => {
    const reg = new RegExp(pattern)
    if (!reg.test(value)) {
      setShowTips(tips)
      setTimeout(() => setShowTips(''), 1000)
      return false
    }
    return true
  }

  // 生成许可证
  const generate = async () => {
    if (!validateInput(userName, '^[a-zA-Z]+$', '用户名只能使用字母')) return
    if (!validateInput(versionName, '^[1-9][0-9]*\\.?\\d{0,1}$', '版本号格式不正确')) return
    if (!validateInput(userNum, '^[1-9]+\d*$', '用户数必须为正整数(1~9)')) return

    const versionNameArr = versionName.split('.')
    const majorVersion = parseInt(versionNameArr[0])
    const minorVersion = versionNameArr.length === 2 ? (parseInt(versionNameArr[1]) || 0) : 0

    const licenseStr = generateLicense(licenseType, userName, parseInt(userNum), majorVersion, minorVersion)

    const zip = new JSZip()
    zip.file("Pro.key", licenseStr)
    const content = await zip.generateAsync({ type: "blob" })
    saveAs(content, "Custom.mxtpro")
  }

  return (
    <div className="w-full max-w-lg mx-auto bg-white rounded-xl shadow-md p-6">
      <h1 className="text-2xl font-bold text-center text-green-600 mb-8">MobaXterm KeyGen</h1>

      <div className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">版本：</label>
          <select
            value={licenseType}
            onChange={(e) => setLicenseType(Number(e.target.value))}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            {Object.entries(LICENSE_TYPES).map(([key, value]) => (
              <option key={key} value={value}>{key}</option>
            ))}
          </select>
        </div>

        <div className="relative">
          <label className="block font-semibold mb-1">用户名：</label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="示例 defaultUser"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <div className="relative">
          <label className="block font-semibold mb-1">版本号：</label>
          <input
            type="text"
            value={versionName}
            onChange={(e) => setVersionName(e.target.value)}
            placeholder="示例 21.0"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <div className="relative">
          <label className="block font-semibold mb-1">用户数：</label>
          <input
            type="text"
            value={userNum}
            onChange={(e) => setUserNum(e.target.value)}
            placeholder="示例 1"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        {showTips && (
          <div className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow-lg">
            {showTips}
          </div>
        )}

        <button
          onClick={generate}
          className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors"
        >
          生成
        </button>
      </div>
    </div>
  )
}
