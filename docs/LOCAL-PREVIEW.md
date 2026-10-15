# Local Bike Portal preview

The Windows task `Bike Portal Local Preview` runs `scripts/start-bike-preview.ps1` from the selected project. It starts at user sign-in and is configured to restart on failure. It serves http://localhost:8790 using local disposable SQLite only; it does not connect to production D1/R2 or deploy a Worker. The computer must be awake and the user signed in. Local accounts reset if the process restarts.

To start manually: open Task Scheduler, choose Task Scheduler Library, select Bike Portal Local Preview, and choose Run. To stop it choose End. To prevent future sign-in startup choose Disable. No passwords are stored in this task.
