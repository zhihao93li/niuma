// src/services/statsService.ts
import { getRepository, Between } from 'typeorm';
import { ClockRecord } from '../models/ClockRecord';

export class StatsService {
  async getHeatmapData(userId: string, startDate: Date, endDate: Date, type: 'hourlyRate' | 'workHours'): Promise<Array<{ date: string; value: number }>> {
    const clockRecordRepository = getRepository(ClockRecord);

    const records = await clockRecordRepository.find({
      where: {
        user: { id: userId },
        date: Between(startDate, endDate),
      },
      order: { date: 'ASC' },
    });

    return records
      .map(record => ({
        date: record.date.toISOString().split('T')[0],
        value: type === 'hourlyRate' ? record.actualHourlyRate : record.actualWorkHours,
      }))
      .filter((item): item is { date: string; value: number } => item.value !== undefined);
  }
}
