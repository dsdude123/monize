'use client';

import { useTranslations } from 'next-intl';
import { CsvRejectedRowDetail, CsvRejectedRowGroup } from '@/lib/import';

interface RejectedRowsNoticeProps {
  groups: CsvRejectedRowGroup[];
  total: number;
}

/**
 * Rows the CSV parser refused, grouped by reason, each named by its row
 * number and the cells that decided it so the person can find and fix it.
 */
export function RejectedRowsNotice({ groups, total }: RejectedRowsNoticeProps) {
  const t = useTranslations('import');
  const cell = (value: string) => value || t('review.rejectedEmptyCell');
  const rowLabel = (row: CsvRejectedRowDetail) =>
    row.fileName
      ? t('review.rejectedRowInFile', { file: row.fileName, row: row.rowNumber })
      : t('review.rejectedRow', { row: row.rowNumber });

  return (
    <div className="mt-2 text-sm text-red-600 dark:text-red-400 space-y-1">
      <p>{t('review.rejectedNotice', { count: total })}</p>
      <ul className="ml-4 list-disc space-y-2">
        {groups.map((group) => (
          <li key={group.reason}>
            <p>
              {t(`review.rejectedReasons.${group.reason}` as Parameters<typeof t>[0])}: {group.count}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {t(`review.rejectedReasonHints.${group.reason}` as Parameters<typeof t>[0])}
            </p>
            <ul className="mt-1 ml-4 list-[circle] text-xs max-h-48 overflow-y-auto">
              {group.rows.map((row) => (
                <li key={`${row.fileName ?? ''}:${row.rowNumber}`}>
                  <span className="font-medium">{rowLabel(row)}</span>
                  {': '}
                  {t('review.rejectedRowCells', {
                    date: cell(row.date),
                    action: cell(row.action),
                    security: cell(row.security),
                    amount: cell(row.amount),
                  })}
                </li>
              ))}
              {group.count > group.rows.length && (
                <li>{t('review.rejectedMoreRows', { count: group.count - group.rows.length })}</li>
              )}
            </ul>
          </li>
        ))}
      </ul>
      <p>{t('review.rejectedGoBack')}</p>
    </div>
  );
}
