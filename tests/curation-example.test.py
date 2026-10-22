"""Execute the actual Module 14 curation snippet against adversarial fixtures.

Optional scientific-example check: python3 tests/curation-example.test.py
Requires numpy, pandas and RDKit; no external data or docking engines required.
"""
from pathlib import Path
import math
import os
import re
import tempfile
import unittest
import pandas as pd

LESSON = Path(__file__).resolve().parents[1] / "src/app/(tutorial)/applied-cadd-workflows/page.tsx"
EXAMPLE = re.search(r'value: `(from pathlib import Path[\s\S]*?)`,', LESSON.read_text()).group(1)


class CurationExampleTest(unittest.TestCase):
    def test_assay_context_replicates_and_review_ledger(self):
        def record(identifier, value, assay="A", endpoint="IC50", relation="=", smiles="CCO"):
            return dict(compound_id=identifier, smiles=smiles, activity_nm=value,
                        assay_id=assay, endpoint=endpoint, relation=relation)

        records = [
            record("rep1", 1), record("rep2", 9),
            record("other_assay", 100, assay="B"),
            record("other_endpoint", 5, endpoint="Ki"),
            record("censored", 50, relation=">"),
            record("zero", 0), record("negative", -1),
            record("missing_value", None), record("infinite", float("inf")),
            record("missing_context", 5, assay=None),
            record("invalid_structure", 5, smiles="not_a_smiles"),
        ]
        with tempfile.TemporaryDirectory(prefix="learn-cadd-curation-") as directory:
            previous = Path.cwd()
            try:
                os.chdir(directory)
                Path("data/raw").mkdir(parents=True)
                pd.DataFrame(records).to_csv("data/raw/assays.csv", index=False)
                exec(compile(EXAMPLE, str(LESSON), "exec"), {})
                summary = pd.read_csv("data/processed/curated_compounds.csv")
                retained = pd.read_csv("data/processed/assay_records.csv")
                review = pd.read_csv("data/processed/assays_for_review.csv")
                self.assertEqual(len(summary), 3)  # incompatible assays/endpoints never merged
                row = summary.query("assay_id == 'A' and endpoint == 'IC50'").iloc[0]
                self.assertEqual(row.n_records, 2)
                self.assertAlmostEqual(row.p_activity, 9 - math.log10(3))
                self.assertNotEqual(row.p_activity, 9)  # not strongest-activity selection
                self.assertEqual(len(retained), 4)
                self.assertEqual(len(review), 7)
                self.assertEqual(len(retained) + len(review), len(records))
                self.assertIn("invalid_structure", review.compound_id.tolist())
                self.assertIn("censored", review.compound_id.tolist())
                self.assertTrue(summary.mw.gt(0).all())
            finally:
                os.chdir(previous)


if __name__ == "__main__":
    unittest.main()
