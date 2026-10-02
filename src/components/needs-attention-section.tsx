import { formatDdMmYyyy } from "../data/parse-csv-date";
import {
  PRIORITY_ACTION_LABELS,
  type RankedCase,
} from "../domain/rank-priority-cases";
import { Card, CardGrid } from "./card";

type NeedsAttentionSectionProps = {
  cases: RankedCase[];
};

function formatPct(value: number | null): string {
  return value === null ? "—" : `${value}%`;
}

function formatFiled(value: Date | null): string {
  return value ? formatDdMmYyyy(value) : "—";
}

export function NeedsAttentionSection({ cases }: NeedsAttentionSectionProps) {
  return (
    <section className="needs-attention">
      <h2 className="section-title">Needs attention</h2>
      <p className="section-subtitle">
        {cases.length} cases in the priority queue
      </p>

      <CardGrid>
        {cases.map((row) => (
          <Card
            key={row.employee_id}
            label={row.full_name}
            value={PRIORITY_ACTION_LABELS[row.action]}
          >
            <dl className="card-fields">
              <div>
                <dt>ID</dt>
                <dd>{row.employee_id}</dd>
              </div>
              <div>
                <dt>Company</dt>
                <dd>{row.company}</dd>
              </div>
              <div>
                <dt>Case status</dt>
                <dd>{row.case_status ?? "—"}</dd>
              </div>
              <div>
                <dt>Profile %</dt>
                <dd>{formatPct(row.profile_completion_pct)}</dd>
              </div>
              <div>
                <dt>Filed</dt>
                <dd>{formatFiled(row.filed_at)}</dd>
              </div>
              <div>
                <dt>Priority</dt>
                <dd>{row.priority}</dd>
              </div>
            </dl>
          </Card>
        ))}
      </CardGrid>
    </section>
  );
}
