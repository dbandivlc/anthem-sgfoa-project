# Vlocity Build
--------

Vlocity Build is a command line tool to export and deploy Vlocity DataPacks in a source control friendly format through a YAML Manifest describing your project. Its primary goal is to enable Continuous Integration for Vlocity Metadata through source control. It is written as a Node.js Command Line Tool.

# Steps to take BackUp of Vlocity Components
--------

## Steps to setup Vlocity Build and Git

### Create a folder in local directory 
```bash
mkdir <projectname>
```

### Clone the Vlocity build Repo to your local directory
```bash
git remove set-url origin git@gihub.com:<username>/<repositoryname>.git
```

### Reset the Git Remote URL
```bash
git remove set-url origin git@gihub.com:<username>/<repositoryname>.git
```

### Setup Properties file
Copy `build.properties` file and rename as `build_<Unique_Org_Name>.properties`
Update `username` `password` `loginURL` and `dataPacksJobsFolder`

### Create a Job file
You can find sample jobs files inside `dataPacksJobs`. You can clone one of the file and modify according to your needs.
Rename projectpath as the release label name : `<ReleaseDate>_<ProjectName>_<Unique_Org_Name>_Release_BackUp`

### Export Vlocity components 
```bash
vlocity packExport -propertyfile build_<Unique_Org_Name>.properties -job <ReleaseDate>_<ProjectName>_<Unique_Org_Name>_Release_BackUp_Release_BackUp.yaml
```

### Create a git branch
```bash
git checkout -b <ReleaseDate>_<ProjectName>_<Unique_Org_Name>_Release_BackUp_Release_BackUp
```

### Push the exports to git.
```bash
git add .
git commit -m "<Your_Release_Label">
git push --set-upstream origin <ReleaseDate>_<ProjectName>_<Unique_Org_Name>_Release_BackUp_Release_BackUp
```
