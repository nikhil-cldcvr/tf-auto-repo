import pandas as pd

# Read the CSV file
csv_file = "SonarQube_Coverage_Report.csv"
xlsx_file = "SonarQube_Coverage_Report.xlsx"

try:
    df = pd.read_csv(csv_file)

    # Write to Excel with formatting
    with pd.ExcelWriter(xlsx_file, engine="openpyxl") as writer:
        df.to_excel(writer, sheet_name="Coverage Report", index=False)

    print(f"✅ SUCCESS: Converted {csv_file} to {xlsx_file}")

except Exception as e:
    print(f"❌ ERROR: {e}")
