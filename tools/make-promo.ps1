# NovaCore reklamine grafika: socialiniu tinklu paveikslelis (OG), piktogramos, baneriai.
# Paleisti: powershell -ExecutionPolicy Bypass -File tools\make-promo.ps1
Add-Type -AssemblyName System.Drawing
$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
$pub = Join-Path $root 'public'
$promo = Join-Path $pub 'promo'
New-Item -ItemType Directory -Force $promo | Out-Null

$bgPath = Join-Path $pub 'bg-lich.jpg'
$bg = [System.Drawing.Image]::FromFile($bgPath)
$sky = [System.Drawing.Color]::FromArgb(56, 189, 248)
$indigo = [System.Drawing.Color]::FromArgb(99, 102, 241)

function New-Logo([int]$size) {
    $bmp = New-Object System.Drawing.Bitmap $size, $size, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = 'AntiAlias'; $g.Clear([System.Drawing.Color]::Transparent)
    $s = $size / 64.0
    $rect = New-Object System.Drawing.RectangleF (4 * $s), (4 * $s), (56 * $s), (56 * $s)
    $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush $rect, $sky, $indigo, 45.0
    $g.FillEllipse($brush, $rect)
    $pen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(90, 147, 197, 253)), ([float][Math]::Max(1, 2 * $s))
    $g.DrawEllipse($pen, (5 * $s), (5 * $s), (54 * $s), (54 * $s))
    $pts = @()
    for ($i = 0; $i -lt 10; $i++) {
        $r = if ($i % 2 -eq 0) { 19 * $s } else { 8 * $s }
        $a = [Math]::PI * ($i * 36 - 90) / 180.0
        $pts += New-Object System.Drawing.PointF ((32 * $s) + $r * [Math]::Cos($a)), ((33 * $s) + $r * [Math]::Sin($a))
    }
    $g.FillPolygon([System.Drawing.Brushes]::White, [System.Drawing.PointF[]]$pts)
    $g.Dispose()
    return $bmp
}

function Save-Png($bmp, $path) { $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png); $bmp.Dispose(); "{0}  {1:N0} B" -f $path, (Get-Item $path).Length }

function New-Canvas([int]$w, [int]$h, [double]$focusX = 0.55, [double]$focusY = 0.35) {
    $bmp = New-Object System.Drawing.Bitmap $w, $h
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = 'AntiAlias'; $g.InterpolationMode = 'HighQualityBicubic'; $g.TextRenderingHint = 'AntiAliasGridFit'
    $scale = [Math]::Max($w / $bg.Width, $h / $bg.Height)
    $sw = $w / $scale; $sh = $h / $scale
    $sx = ($bg.Width - $sw) * $focusX; $sy = ($bg.Height - $sh) * $focusY
    $dest = New-Object System.Drawing.RectangleF 0, 0, $w, $h
    $src = New-Object System.Drawing.RectangleF ([single]$sx), ([single]$sy), ([single]$sw), ([single]$sh)
    $g.DrawImage($bg, $dest, $src, [System.Drawing.GraphicsUnit]::Pixel)
    # tamsinimas is kaires, kad tekstas butu skaitomas
    $ov = New-Object System.Drawing.Drawing2D.LinearGradientBrush (New-Object System.Drawing.Rectangle 0, 0, $w, $h), ([System.Drawing.Color]::FromArgb(235, 7, 12, 24)), ([System.Drawing.Color]::FromArgb(60, 7, 12, 24)), ([System.Drawing.Drawing2D.LinearGradientMode]::Horizontal)
    $g.FillRectangle($ov, 0, 0, $w, $h)
    return @{ Bmp = $bmp; G = $g }
}

function Draw-Text($g, [string]$text, [string]$font, [single]$px, [bool]$bold, $color, [single]$x, [single]$y) {
    $style = if ($bold) { [System.Drawing.FontStyle]::Bold } else { [System.Drawing.FontStyle]::Regular }
    $f = New-Object System.Drawing.Font $font, $px, $style, ([System.Drawing.GraphicsUnit]::Pixel)
    $b = New-Object System.Drawing.SolidBrush $color
    $g.DrawString($text, $f, $b, $x, $y)
    $f.Dispose(); $b.Dispose()
}

$white = [System.Drawing.Color]::White
$muted = [System.Drawing.Color]::FromArgb(205, 255, 255, 255)

# ---- 1) Socialiniu tinklu paveikslelis 1200x630 (Open Graph / Discord / Facebook) ----
$c = New-Canvas 1200 630
$g = $c.Bmp; $gr = $c.G
$logo = New-Logo 150; $gr.DrawImage($logo, 80, 70, 110, 110); $logo.Dispose()
Draw-Text $gr 'NovaCore' 'Segoe UI Semibold' 104 $true $white 70 205
Draw-Text $gr 'Lietuviškas Ličo Karaliaus rūstybės serveris' 'Segoe UI' 38 $false $muted 78 335
Draw-Text $gr 'WotLK 3.3.5a  ·  HD klientas  ·  lietuvių kalba' 'Segoe UI Semibold' 30 $false $sky 80 400
Draw-Text $gr 'Hardkoro režimas  ·  Asmeninis grobis  ·  Paleidiklis su automatiniu atnaujinimu' 'Segoe UI' 26 $false $muted 80 470
Draw-Text $gr 'novacore-site.vercel.app' 'Segoe UI Semibold' 30 $true $white 80 545
$gr.Dispose()
$jpgCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$ep = New-Object System.Drawing.Imaging.EncoderParameters 1
$ep.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality), 86L
$ogPath = Join-Path $pub 'og-default.jpg'
$g.Save($ogPath, $jpgCodec, $ep); $g.Dispose()
"{0}  {1:N0} B" -f $ogPath, (Get-Item $ogPath).Length

# ---- 2) Piktogramos ----
$sizes = 16, 32, 48, 64, 128, 256
$pngs = @()
foreach ($sz in $sizes) { $b = New-Logo $sz; $ms = New-Object System.IO.MemoryStream; $b.Save($ms, [System.Drawing.Imaging.ImageFormat]::Png); $pngs += , $ms.ToArray(); $b.Dispose() }
$icoPath = Join-Path $pub 'favicon.ico'
$fs = [System.IO.File]::Create($icoPath); $bw = New-Object System.IO.BinaryWriter $fs
$bw.Write([uint16]0); $bw.Write([uint16]1); $bw.Write([uint16]$sizes.Count)
$offset = 6 + 16 * $sizes.Count
for ($i = 0; $i -lt $sizes.Count; $i++) {
    $sz = $sizes[$i]; $dim = if ($sz -ge 256) { 0 } else { $sz }
    $bw.Write([byte]$dim); $bw.Write([byte]$dim); $bw.Write([byte]0); $bw.Write([byte]0)
    $bw.Write([uint16]1); $bw.Write([uint16]32); $bw.Write([uint32]$pngs[$i].Length); $bw.Write([uint32]$offset)
    $offset += $pngs[$i].Length
}
foreach ($p in $pngs) { $bw.Write($p) }
$bw.Close(); $fs.Close()
"{0}  {1:N0} B" -f $icoPath, (Get-Item $icoPath).Length
Save-Png (New-Logo 512) (Join-Path $promo 'logo-512.png')
Save-Png (New-Logo 180) (Join-Path $pub 'apple-touch-icon.png')

# ---- 3) Baneriai (platus: logo + tekstas kairėje) ----
function New-Banner([int]$w, [int]$h, [string]$name) {
    $c = New-Canvas $w $h
    $b = $c.Bmp; $g = $c.G
    $pad = [int]($h * 0.14)
    $ls = [int]($h - 2 * $pad)
    $logo = New-Logo ($ls * 2); $g.DrawImage($logo, $pad, $pad, $ls, $ls); $logo.Dispose()
    $tx = $pad * 2 + $ls
    Draw-Text $g 'NovaCore' 'Segoe UI Semibold' ($h * 0.38) $true $white $tx ($h * 0.10)
    Draw-Text $g 'Lietuviškas WoW 3.3.5a serveris' 'Segoe UI' ($h * 0.20) $false $muted ($tx + 2) ($h * 0.56)
    $g.Dispose()
    Save-Png $b (Join-Path $promo $name)
}
New-Banner 468 60 'banner-468x60.png'
New-Banner 728 90 'banner-728x90.png'
New-Banner 234 60 'banner-234x60.png'

# ---- 4) 300x250 (stačiakampis) ----
$c = New-Canvas 300 250 0.6 0.3
$b = $c.Bmp; $g = $c.G
$logo = New-Logo 160; $g.DrawImage($logo, 20, 18, 56, 56); $logo.Dispose()
Draw-Text $g 'NovaCore' 'Segoe UI Semibold' 40 $true $white 18 84
Draw-Text $g 'Lietuviškas WoW serveris' 'Segoe UI' 18 $false $muted 20 134
Draw-Text $g 'WotLK 3.3.5a · HD · lietuvių k.' 'Segoe UI Semibold' 15 $false $sky 20 162
Draw-Text $g 'Hardkoras · Asmeninis grobis' 'Segoe UI' 14 $false $muted 20 188
Draw-Text $g 'novacore-site.vercel.app' 'Segoe UI Semibold' 15 $true $white 20 216
$g.Dispose()
Save-Png $b (Join-Path $promo 'banner-300x250.png')

$bg.Dispose()
