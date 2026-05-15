@extends('documents.layout')

@section('content')
    <div class="section">
        <div class="section-title">Attestation de Scolarité</div>

        <p style="margin: 20px 0; text-align: justify;">
            Le Directeur de l'Université Privée de Fès atteste que :
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
            est régulièrement inscrit(e) à l'Université Privée de Fès pour l'année universitaire {{ date('Y') }}-{{ date('Y') + 1 }}.
        </p>

        <p style="margin: 20px 0; text-align: justify;">
            Cette attestation est délivrée à l'intéressé(e) pour servir et valoir ce que de droit.
        </p>

        <div style="margin-top: 30px;">
            <span class="badge badge-success">Document Validé</span>
        </div>
    </div>
@endsection
