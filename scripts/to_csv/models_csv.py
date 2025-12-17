import pandas as pd
import csv

read_file = pd.read_excel("./doc/model/models_version_1.xlsx")
read_file.to_csv("./doc/vehicle/vehicles_version_1.csv", index=None)

# Input and output file names
input_file = "./doc/vehicle/vehicles_version_1.csv" 
output_file = "./doc/model/models_version_1.csv"

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
