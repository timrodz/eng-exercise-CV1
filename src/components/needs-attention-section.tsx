import { formatDdMmYyyy } from "../data/parse-csv-date";
import {
  PRIORITY_ACTION_LABELS,
  type PriorityAction,
  type RankedCase,
} from "../domain/rank-priority-cases";
import { Card, CardGrid } from "./card";

type NeedsAttentionSectionProps = {
  cases: RankedCase[];
};

const ACTION_BADGE_COLOR: Record<PriorityAction, string> = {
  respond_to_rfe: "#c62828",
  review_denial: "#6a1b9a",
  submit_application: "#ed6c02",
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
            label={
              <span
                className="badge"
                style={{ background: ACTION_BADGE_COLOR[row.action] }}
              >
                {PRIORITY_ACTION_LABELS[row.action]}
              </span>
            }
            value={`${row.employee_id} | ${row.full_name}`}
          >
            <dl className="card-fields">
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
