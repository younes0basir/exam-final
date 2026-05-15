@extends('documents.layout')

@section('content')
    <div class="section">
        <div class="section-title">Certificat d'Inscription</div>

        <p style="margin: 20px 0; text-align: justify;">
            Le Directeur de l'Université Privée de Fès certifie que :
        </p>

        <div class="info-row">
            <span class="info-label">Nom et Prénom :</span>
            <span class="info-value">{{ $user->name }}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Email :</span>
            <span class="info-value">{{ $user->email }}</span>
        </div>
        @if($filiere)
        <div class="info-row">
            <span class="info-label">Filière :</span>
            <span class="info-value">{{ $filiere->nom }}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Code Filière :</span>
            <span class="info-value">{{ $filiere->code ?? 'N/A' }}</span>
        </div>
        @endif
        @if($groupe)
        <div class="info-row">
            <span class="info-label">Groupe :</span>
            <span class="info-value">{{ $groupe->nom }}</span>
        </div>
        @endif

        <p style="margin: 30px 0; text-align: justify;">
            est régulièrement inscrit(e) à l'Université Privée de Fès pour l'année universitaire <strong>{{ $annee_universitaire }}</strong>.
        </p>

        <p style="margin: 20px 0; text-align: justify;">
            Ce certificat est délivré à l'intéressé(e) pour servir et valoir ce que de droit.
        </p>

        <div style="margin-top: 30px;">
            <span class="badge badge-success">Document Validé</span>
        </div>
    </div>
@endsection
