'use client'

import type { QualityDomain } from './types'

interface TableViewProps {
  domain: QualityDomain
}

export default function TableView({ domain }: TableViewProps) {
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-auto pointer-events-auto">
        <h2 className="text-2xl font-bold mb-4">{domain.name}</h2>
        <p className="text-sm text-gray-600 mb-4">
          {domain.dimensions.length}-dimensional space (table view)
        </p>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b-2 border-gray-300">
                <th className="px-4 py-2 text-left font-semibold">Dimension Name</th>
                <th className="px-4 py-2 text-left font-semibold">Minimum</th>
                <th className="px-4 py-2 text-left font-semibold">Maximum</th>
              </tr>
            </thead>
            <tbody>
              {domain.dimensions.map((dimension, index) => (
                <tr
                  key={dimension.id}
                  className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  <td className="px-4 py-3 border-b border-gray-200 font-medium">
                    {dimension.name}
                  </td>
                  <td className="px-4 py-3 border-b border-gray-200">
                    {dimension.range[0]}
                  </td>
                  <td className="px-4 py-3 border-b border-gray-200">
                    {dimension.range[1]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
