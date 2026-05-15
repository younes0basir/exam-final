@extends('documents.layout')

@section('content')
    <div class="section">
        <div class="section-title">Ordre de Mission</div>

        <div class="info-row">
            <span class="info-label">Référence :</span>
            <span class="info-value">{{ $reference }}</span>
        </div>

        <p style="margin: 30px 0; text-align: justify;">
            Le Directeur de l'Université Privée de Fès donne ordre à :
        </p>

        <div class="info-row">
            <span class="info-label">Nom et Prénom :</span>
            <span class="info-value">{{ $user->name }}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Email :</span>
            <span class="info-value">{{ $user->email }}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Fonction :</span>
            <span class="info-value">Professeur</span>
        </div>

        <p style="margin: 30px 0; text-align: justify;">
            d'effectuer une mission pour le compte de l'Université Privée de Fès.
        </p>

        @if($demande->motif)
        <div class="info-row">
            <span class="info-label">Motif de la mission :</span>
            <span class="info-value">{{ $demande->motif }}</span>
        </div>
        @endif

        <p style="margin: 30px 0; text-align: justify;">
            L'intéressé(e) est autorisé(e) à percevoir les indemnités de mission conformément à la réglementation en vigueur.
        </p>

        <p style="margin: 20px 0; text-align: justify;">
            Le présent ordre de mission est délivré pour servir et valoir ce que de droit.
        </p>

        <div style="margin-top: 30px;">
            <span class="badge badge-success">Document Validé</span>
        </div>
    </div>
@endsection
