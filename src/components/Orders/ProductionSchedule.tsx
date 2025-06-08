import React from 'react';
import { OrderMachine } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import { useMachines } from '@/hooks/useMachines';

interface ProductionScheduleProps {
  selectedMachines: OrderMachine[];
}

const ProductionSchedule: React.FC<ProductionScheduleProps> = ({
  selectedMachines
}) => {
  const { machines } = useMachines();

  const calculateStartTime = () => {
    if (selectedMachines.length === 0) return null;
    
    // Check actual machine availability
    const now = new Date();
    let maxWaitTime = 0;
    let hasOccupiedMachine = false;

    selectedMachines.forEach(orderMachine => {
      const machine = machines.find(m => m.id === orderMachine.machineId);
      if (machine) {
        if (machine.status === 'occupied' && machine.estimatedFreeTime) {
          hasOccupiedMachine = true;
          const freeTime = new Date(machine.estimatedFreeTime);
          const waitTime = Math.max(0, (freeTime.getTime() - now.getTime()) / (1000 * 60 * 60));
          maxWaitTime = Math.max(maxWaitTime, waitTime);
        }
      }
    });

    const startTime = new Date(now.getTime() + maxWaitTime * 60 * 60 * 1000);
    
    return {
      startTime,
      waitTime: Math.ceil(maxWaitTime),
      hasOccupiedMachine
    };
  };

  const schedule = calculateStartTime();

  if (!schedule || selectedMachines.length === 0) {
    return null;
  }

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <Clock className="h-5 w-5" />
          Production Schedule
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {schedule.hasOccupiedMachine ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                Waiting Period
              </Badge>
              <span className="text-sm font-medium">
                {schedule.waitTime} hour{schedule.waitTime !== 1 ? 's' : ''}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              Some machines are currently occupied. Your order will start after the current jobs are completed.
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-green-100 text-green-800">
              Ready to Start
            </Badge>
            <span className="text-sm">All machines are available</span>
          </div>
        )}
        
        <div className="pt-2 border-t">
          <p className="text-sm">
            <span className="font-medium">Estimated Start Time:</span>{' '}
            {schedule.startTime.toLocaleString()}
          </p>
          
          <div className="mt-2">
            <p className="text-xs text-gray-500 mb-1">Machine Schedule:</p>
            {selectedMachines.map((machine) => (
              <div key={machine.id} className="text-xs text-gray-600">
                • {machine.machineName}: {machine.estimatedHours}h
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductionSchedule;
