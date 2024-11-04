# installing dependencies
`yarn install`

# running the import script
The csv should hav same structure as template provided in `advisors.csv`
`yarn import-advisor -- --file=advisors.csv`

# getting the output
The output_{timestampt}.csv will contain username, and password.

# debugging
If the script cannot import successful, the failed import will also be included in the output csv files. The Error column will say what went wrong. Column like, broad scope, narrow scope, current_company have most errors. You can see allow values of each column in this file `scripts/src/utils/encode.ts`. Either add new values in there or fix the value in csv is up to the choice.

# Most Common Error
array values like narrow scope are separated by `, `. So, if the values in the csv columns contain too many comma, you might need to update your csv before importing so that it split narrow_scope correctly.  