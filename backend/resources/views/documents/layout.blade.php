<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>{{ $title ?? 'Document UPF' }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            font-size: 12pt;
            line-height: 1.6;
            color: #333;
            padding: 40px;
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 3px solid #1e40af;
        }
        .header h1 {
            font-size: 24pt;
            color: #1e40af;
            margin-bottom: 10px;
        }
        .header h2 {
            font-size: 16pt;
            color: #64748b;
            font-weight: normal;
        }
        .logo {
            font-size: 28pt;
            font-weight: bold;
            color: #1e40af;
            margin-bottom: 10px;
        }
        .content {
            margin: 30px 0;
        }
        .reference {
            text-align: right;
            font-size: 10pt;
            color: #64748b;
            margin-bottom: 20px;
        }
        .section {
            margin: 20px 0;
        }
        .section-title {
            font-size: 14pt;
            font-weight: bold;
            color: #1e40af;
            margin-bottom: 10px;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 5px;
        }
        .info-row {
            margin: 8px 0;
            display: flex;
        }
        .info-label {
            font-weight: bold;
            width: 200px;
            color: #475569;
        }
        .info-value {
            flex: 1;
        }
        .footer {
            margin-top: 60px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            text-align: center;
            font-size: 10pt;
            color: #64748b;
        }
        .signature {
            margin-top: 50px;
            text-align: right;
        }
        .signature-line {
            margin-top: 60px;
            border-top: 1px solid #333;
            width: 200px;
            display: inline-block;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        th, td {
            border: 1px solid #e2e8f0;
            padding: 10px;
            text-align: left;
        }
        th {
            background-color: #1e40af;
            color: white;
            font-weight: bold;
        }
        tr:nth-child(even) {
            background-color: #f8fafc;
        }
        .badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 4px;
            font-size: 10pt;
            font-weight: bold;
        }
        .badge-success {
            background-color: #dcfce7;
            color: #166534;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">UPF</div>
        <h1>Université Privée de Fès</h1>
        <h2>{{ $title ?? 'Document Officiel' }}</h2>
    </div>

    <div class="reference">
        Référence : {{ $reference ?? 'N/A' }}<br>
        Date d'émission : {{ $date_emission ?? date('d/m/Y') }}
    </div>

    <div class="content">
        @yield('content')
    </div>

    <div class="footer">
        <p>Université Privée de Fès - Document officiel généré automatiquement</p>
        <p>Ce document est valide sans signature ni cachet</p>
    </div>

    <div class="signature">
        <p>Le Directeur des Études</p>
        <div class="signature-line"></div>
    </div>
</body>
</html>
