$projectUrl = "https://jzskhrogiesqkeygtaqf.supabase.co"
$anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6c2tocm9naWVzcWtleWd0YXFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxNTk0MTksImV4cCI6MjA4NTczNTQxOX0.n9NK7ta_IGm1rs7D6aAcwRZwOLCObRuQ6hyCD-IBBdY"
$baseDir = Get-Location

function Upload-Project($bucket, $relativePath, $folderName, $supabaseNamePrefix, $count) {
    $targetDir = Join-Path $baseDir (Join-Path $relativePath $folderName)    
    Write-Host "--- Processing $folderName in $targetDir ---"
    if (-not (Test-Path $targetDir)) {
        Write-Warning "Directory not found: $targetDir"
        return
    }
    
    $files = Get-ChildItem -Path $targetDir -Filter *.jpg -Recurse | Select-Object -First $count
    if (-not $files) {
        Write-Warning "No JPG files found in $targetDir"
        return
    }
    
    $i = 1
    foreach ($file in $files) {
        $folderSlug = $folderName.ToLower().Replace(" ", "-")
        $supabasePath = "$folderSlug/$supabaseNamePrefix $( "{0:D2}" -f $i ).jpg"
        $uploadUrl = "$projectUrl/storage/v1/object/$bucket/$supabasePath"
        
        Write-Host "  [$i] Uploading $($file.Name) -> $supabasePath"
        
        $headers = @{
            "Authorization" = "Bearer $anonKey"
            "apikey"        = $anonKey
            "Content-Type"  = "image/jpeg"
            "x-upsert"      = "true"
        }
        
        try {
            $response = Invoke-RestMethod -Uri $uploadUrl -Method Post -Headers $headers -InFile $file.FullName
            Write-Host "    Success: $($response.Key)"
        }
        catch {
            Write-Error "    Failed! Error: $_"
        }
        
        $i++
    }
}

$hogarRoot = "Galeria\PAGINA WEB VERZA\HOGAR"
Upload-Project "hogar" $hogarRoot "DANIEL" "DANIEL" 5
Upload-Project "hogar" $hogarRoot "DANTE" "DANTE" 5
Upload-Project "hogar" $hogarRoot "ELENA" "ELENA" 4
Upload-Project "hogar" $hogarRoot "JOCE" "JOCE" 4
Upload-Project "hogar" $hogarRoot "JUANPA" "JUANPA" 5

$comercialRoot = "Galeria\PAGINA WEB VERZA\COMERCIAL"
Upload-Project "comercial" $comercialRoot "CHERNIKA" "CHERNIKA" 5
Upload-Project "comercial" $comercialRoot "LAUNDRY" "LAUNDRY" 4
Upload-Project "comercial" $comercialRoot "NAILS BAR" "NAILS BAR" 4

$experienciasRoot = "Galeria\PAGINA WEB VERZA\EXPERICENCIAS"
Upload-Project "experiencias" $experienciasRoot "INNOVA" "INNOVA" 5
Upload-Project "experiencias" $experienciasRoot "JUMPINGLAND" "JUMPINGLAND" 6
Upload-Project "experiencias" $experienciasRoot "PANACA" "PANACA" 5
