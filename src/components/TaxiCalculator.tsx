'use client'
import { useState } from 'react'
import DatePicker, { registerLocale } from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import zhCN from 'date-fns/locale/zh-CN'

// 注册中文语言包
// eslint-disable-next-line @typescript-eslint/no-explicit-any
registerLocale('zh-CN', zhCN as any)  // 暂时使用 any 类型

interface CalculationResult {
  maxAmount: number
  totalReceiptAmount: number
  excessAmount?: number
  bestSum?: number
  bestCombination?: number[]
  receiptsToDiscard?: number[]
}

export default function TaxiCalculator() {
  const [days, setDays] = useState('')
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null])
  const [receipts, setReceipts] = useState('')
  const [result, setResult] = useState<CalculationResult | null>(null)

  // 计算出差天数
  const calculateDays = (start: Date, end: Date) => {
    const diffTime = Math.abs(end.getTime() - start.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
  }

  // 处理日期选择
  const handleDateRangeChange = (update: [Date | null, Date | null]) => {
    setDateRange(update)
    const [start, end] = update
    if (start && end) {
      setDays(calculateDays(start, end).toString())
    }
  }

  // 工具函数
  const formatMoney = (num: number) => {
    return (
      <span>
        <span className="font-sans">¥</span>
        <span className="font-mono">{num.toFixed(2)}</span>
      </span>
    )
  }

  // 核心计算逻辑
  const findBestReceiptsDP = (receipts: number[], maxAmount: number) => {
    const scaledMax = maxAmount * 100
    const scaledReceipts = receipts.map(r => Math.round(r * 100))
    const dp = new Array(scaledMax + 1).fill(0)
    const used = new Array(scaledMax + 1).fill(null).map(() => [] as number[])

    for (let i = 0; i < scaledReceipts.length; i++) {
      const receipt = scaledReceipts[i]
      for (let j = scaledMax; j >= receipt; j--) {
        const newSum = dp[j - receipt] + receipt
        if (newSum > dp[j]) {
          dp[j] = newSum
          used[j] = [...used[j - receipt], receipts[i]]
        }
      }
    }

    let bestIndex = dp.length - 1
    while (bestIndex > 0 && dp[bestIndex] === dp[bestIndex - 1]) bestIndex--
    return used[bestIndex]
  }

  const calculate = () => {
    // 检查是否有天数输入
    if (!days) return

    const daysNum = parseInt(days)
    if (isNaN(daysNum) || daysNum <= 0) return

    const receiptsList = receipts
      .split(',')
      .map(r => parseFloat(r.trim()))
      .filter(r => !isNaN(r))

    if (receiptsList.length === 0) return

    const maxAmount = 80 * daysNum
    const totalReceiptAmount = receiptsList.reduce((a, b) => a + b, 0)
    const excessAmount = Math.max(0, totalReceiptAmount - maxAmount)

    if (totalReceiptAmount <= maxAmount) {
      setResult({ maxAmount, totalReceiptAmount })
      return
    }

    const bestCombination = findBestReceiptsDP(receiptsList, maxAmount)
    const bestSum = bestCombination.reduce((a, b) => a + b, 0)
    const receiptsToDiscard = receiptsList.filter(r => !bestCombination.includes(r))

    setResult({
      maxAmount,
      totalReceiptAmount,
      excessAmount,
      bestSum,
      bestCombination,
      receiptsToDiscard
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    calculate()
  }

  return (
    <div className="w-full max-w-lg mx-auto bg-white rounded-xl shadow-md p-6">
      <h1 className="text-2xl font-bold text-center text-green-600 mb-8">报销计算器</h1>

      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-4">
            <label htmlFor="days" className="block font-semibold mb-1">
              出差天数:
            </label>
            <input
              type="number"
              id="days"
              value={days}
              onChange={(e) => setDays(e.target.value)}
              min="1"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="请输入天数"
              required
            />
          </div>

          <div className="col-span-1 flex items-end justify-center mb-2">
            <span className="text-gray-500">或</span>
          </div>

          <div className="col-span-7">
            <label className="block font-semibold mb-1">
              选择日期范围:
            </label>
            <div className="[&>div]:w-full [&_.react-datepicker-wrapper]:w-full [&_.react-datepicker__input-container]:w-full">
              <DatePicker
                selectsRange={true}
                startDate={dateRange[0]}
                endDate={dateRange[1]}
                onChange={handleDateRangeChange}
                dateFormat="yyyy/MM/dd"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-transparent focus:outline-none"
                placeholderText="选择日期范围"
                isClearable={true}
                locale="zh-CN"
                calendarStartDay={1}
                formatWeekDay={nameOfDay => {
                  const days = {
                    '星期一': '一',
                    '星期二': '二',
                    '星期三': '三',
                    '星期四': '四',
                    '星期五': '五',
                    '星期六': '六',
                    '星期日': '日'
                  }
                  return days[nameOfDay as keyof typeof days] || nameOfDay.substr(0, 1)
                }}
              />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="receipts" className="block font-semibold mb-1">
            发票金额（用逗号分隔）:
          </label>
          <input
            type="text"
            id="receipts"
            value={receipts}
            onChange={(e) => setReceipts(e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="例如：30.5, 50.75, 20.25, 80.5"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors"
        >
          计算最佳报销组合
        </button>
      </form>

      {result && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded shadow-sm border">
              <p className="font-semibold mb-2">最大报销额度:</p>
              <span className="text-blue-600 font-bold text-lg">
                {formatMoney(result.maxAmount)}
              </span>
            </div>
            <div className="bg-gray-50 p-4 rounded shadow-sm border">
              <p className="font-semibold mb-2">现有发票总额:</p>
              <span className="text-blue-600 font-bold font-mono text-lg">
                {formatMoney(result.totalReceiptAmount)}
              </span>
            </div>
          </div>

          {result.totalReceiptAmount <= result.maxAmount ? (
            <p className="text-center text-green-600 font-bold">
              未超出报销额度，可全部报销！
            </p>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded shadow-sm border">
                  <p className="font-semibold mb-2">超出报销额度:</p>
                  <span className="text-blue-600 font-bold font-mono text-lg">
                    {formatMoney(result.excessAmount!)}
                  </span>
                </div>
                <div className="bg-gray-50 p-4 rounded shadow-sm border">
                  <p className="font-semibold mb-2">最优报销金额:</p>
                  <span className="text-blue-600 font-bold font-mono text-lg">
                    {formatMoney(result.bestSum!)}
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded shadow-sm border">
                <p className="font-semibold mb-2">发票明细:</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {result.bestCombination!.sort((a, b) => a - b).map((amount, index) => (
                    <span key={index} className="inline-block bg-white px-2 py-1 rounded shadow-sm border border-green-200 text-green-600 font-mono">
                      {formatMoney(amount)}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.receiptsToDiscard!.sort((a, b) => a - b).map((amount, index) => (
                    <span key={index} className="inline-block bg-white px-2 py-1 rounded shadow-sm border border-red-200 text-red-600 line-through font-mono">
                      {formatMoney(amount)}
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}