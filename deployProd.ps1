$title = "Deploy to Prod"
$message = "Are you certain you want to push changes to Prod?"

$yes = New-Object System.Management.Automation.Host.ChoiceDescription "&Yes", `
    "Push to branch master in Github and Heroku. Will override alexandremoureaux.com."

$no = New-Object System.Management.Automation.Host.ChoiceDescription "&No", `
    "Cancel deployment."

$options = [System.Management.Automation.Host.ChoiceDescription[]]($yes, $no)

$result = $host.ui.PromptForChoice($title, $message, $options, 1) 

function Push {git push origin master; git push heroku master}

switch ($result)
{
    0 {Push}
    1 {"Deployment cancelled."}
}