import { adminClient } from '../config/supabase.js';
import { DatabaseError, wrapDatabaseError } from './errors.js';

/**
 * Audit trail entry type
 */
export interface AuditEntry {
  id: string;
  table_name: string;
  record_id: string;
  operation: 'INSERT' | 'UPDATE' | 'DELETE';
  old_values: Record<string, any> | null;
  new_values: Record<string, any> | null;
  changed_by: string | null;
  audit_timestamp: string;
}

/**
 * Query audit trail entries (admin only)
 */
export async function queryAuditTrail(): Promise<AuditEntry[]> {
  try {
    const { data, error } = await adminClient
      .from('audit_trail')
      .select('*')
      .order('audit_timestamp', { ascending: false })
      .limit(1000);

    if (error) {
      throw wrapDatabaseError(error, 'SELECT', 'audit_trail');
    }

    return (data as AuditEntry[]) || [];
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    throw wrapDatabaseError(error, 'SELECT', 'audit_trail');
  }
}

/**
 * Query audit trail entries for a specific user (by their account changes)
 */
export async function queryUserAuditTrail(userId: string): Promise<AuditEntry[]> {
  try {
    const { data, error } = await adminClient
      .from('audit_trail')
      .select('*')
      .eq('changed_by', userId)
      .order('audit_timestamp', { ascending: false })
      .limit(500);

    if (error) {
      throw wrapDatabaseError(error, 'SELECT', 'audit_trail');
    }

    return (data as AuditEntry[]) || [];
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    throw wrapDatabaseError(error, 'SELECT', 'audit_trail');
  }
}

/**
 * Export audit trail as CSV Buffer
 * CSV format: table_name, record_id, operation, audit_timestamp, old_values, new_values, changed_by
 */
export async function exportAuditCSV(userId?: string): Promise<Buffer> {
  try {
    const entries = userId
      ? await queryUserAuditTrail(userId)
      : await queryAuditTrail();

    // CSV headers
    const headers = [
      'table_name',
      'record_id',
      'operation',
      'audit_timestamp',
      'changed_by',
      'old_values',
      'new_values',
    ];

    // Build CSV rows
    const rows = entries.map((entry) => [
      entry.table_name,
      entry.record_id || '',
      entry.operation,
      entry.audit_timestamp,
      entry.changed_by || '',
      entry.old_values ? JSON.stringify(entry.old_values) : '',
      entry.new_values ? JSON.stringify(entry.new_values) : '',
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map((row) =>
        row
          .map((field) => {
            // Escape quotes and wrap in quotes if contains comma
            const escaped = String(field).replace(/"/g, '""');
            return escaped.includes(',') ? `"${escaped}"` : escaped;
          })
          .join(',')
      ),
    ].join('\n');

    return Buffer.from(csvContent, 'utf-8');
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    throw wrapDatabaseError(error, 'EXPORT_CSV', 'audit_trail');
  }
}
