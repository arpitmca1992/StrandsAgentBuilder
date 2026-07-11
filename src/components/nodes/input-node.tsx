import { Handle, Position, type NodeProps, useReactFlow } from '@xyflow/react';
import { MessageSquare, X } from 'lucide-react';

export function InputNode({ data, selected, id }: NodeProps) {
  const { deleteElements } = useReactFlow();
  const label = (data as any)?.label || 'User Input';

  const handleDelete = (event: React.MouseEvent) => {
    event.stopPropagation();
    deleteElements({ nodes: [{ id }] });
  };

  return (
    <div className={`
      rounded-xl border-2 min-w-[140px] transition-all duration-150
      ${selected
        ? 'border-green-500 shadow-xl ring-2 ring-green-200 bg-green-50'
        : 'border-green-300 hover:border-green-400 hover:shadow-md bg-gradient-to-br from-green-50 to-emerald-50'}
    `}>
      <div className="px-4 py-3 flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-green-100 border border-green-200 flex items-center justify-center">
          <MessageSquare className="w-3.5 h-3.5 text-green-600" />
        </div>
        <div className="flex-1">
          <span className="text-sm font-semibold text-green-800">{label}</span>
          <p className="text-[10px] text-green-500">User prompt</p>
        </div>
        {selected && (
          <button
            onClick={handleDelete}
            className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-red-500 rounded transition-colors"
            title="Delete"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="output"
        className="!bg-green-500 !w-3.5 !h-3.5 !border-2 !border-white !absolute"
        style={{ bottom: -7, left: '50%' }}
      />
    </div>
  );
}
