import pandas as pd
import csv

read_file = pd.read_excel("models.xlsx")
read_file.to_csv("vehicles.csv", index=None)

# Input and output file names
input_file = "vehicles.csv"  # change this to your CSV file name
output_file = "models.csv"  # new file with unique rows

# Use a set to track unique rows
unique_rows = set()

with (
    open(input_file, mode="r", encoding="utf-8") as infile,
    open(output_file, mode="w", newline="", encoding="utf-8") as outfile,
):
    reader = csv.reader(infile)
    writer = csv.writer(outfile)

    header = next(reader)
    writer.writerow(header)

    for row in reader:
        row_tuple = tuple(cell.strip() for cell in row)  # normalize spaces
        if row_tuple not in unique_rows:
            unique_rows.add(row_tuple)
            writer.writerow(row)

print(f"✅ Done! Created '{output_file}' with {len(unique_rows)} unique rows.")
